/**
 * Created by archheretic on 19.04.17.
 */
import *  as React from "react";
import {
    StyleSheet,
    Text,
    View,
    ListView, ListViewDataSource, TextStyle, ViewStyle
} from "react-native";
import PureComponent = React.PureComponent;
import { BaseConsumer } from "../api/baseConsumer";
import {ParkingLot} from "../models/parkingLot.model";
import {ParkingLog} from "../models/parkingLog.model";
import {ParkingLotInfo} from "../models/parkingLotInfo.model";

const baseConsumer = new BaseConsumer();

export interface Props {}
export interface State {
    titleText: string;
    dataSource: ListViewDataSource;
}

export class HomeScreen extends PureComponent<Props, State> {
    // test: any = baseConsumer.getAllParkinglots();
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            titleText: "Parkeringsplasser",
            dataSource: ds.cloneWithRows(["No data"])
        };
    }

    componentDidMount() {
        this.fetchData();
    }
    async fetchData() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const parkingLotInfo: ParkingLotInfo[] = await baseConsumer.getParkingLotInfo();
        this.setState({dataSource: ds.cloneWithRows(parkingLotInfo)});
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    {this.state.titleText}
                </Text>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => {
                        if (rowData.name === undefined) {
                            return (
                                <Text style={styles.parkingLotName}>
                                    {"Ingen parkeringsplasser funnet"}
                                </Text>
                            )
                        }

                        let backgroundColor = "#08b243";
                        if (rowData.freeSpaces <= rowData.reservedSpaces && rowData.freeSpaces !== 0) {
                            backgroundColor = "orange";
                        }
                        else if (rowData.freeSpaces === 0) {
                            backgroundColor = "orangered";
                        }
                        return (
                        <Text style={styles.parkingLotName}>
                            {rowData.name}
                            <Text style={styles.parkingLotContent}>
                                {"\n"}
                                <Text style={[styles.parkingLotFreeSpaces, {backgroundColor: backgroundColor}]}>
                                    Ledig: {rowData.freeSpaces} av {rowData.capacity}
                                </Text>
                                {"\n"}
                                Reservert {rowData.reservedSpaces}
                            </Text>
                        </Text>
                    )}
                    }
                />
            </View>
        );
    }
}


interface Style {
    container: ViewStyle,
    title: TextStyle,
    parkingLotName: TextStyle,
    parkingLotFreeSpaces: TextStyle,
    parkingLotContent:TextStyle
}

const styles = StyleSheet.create<Style>({    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        paddingLeft: 20,
        backgroundColor: "#F5FCFF",
    },
    title: {
        fontSize: 24,
        color: "#000000",
        marginBottom: 10,
        marginTop: 10,
        fontWeight: "bold"
    },
    parkingLotName: {
        fontSize: 18,
        textAlign: "left",
        color: "#333333",
        marginBottom: 15,
    },
    parkingLotFreeSpaces: {
        backgroundColor: "#08b243",
        // paddingLeft: 15,
        // paddingRight: 15,
        fontSize: 16,
        textAlign: "left",
        color: "#333333",
        marginBottom: 15,
    },
    parkingLotContent: {
        fontSize: 16,
        textAlign: "left",
        color: "#333333",
        marginBottom: 15,
    }
});
