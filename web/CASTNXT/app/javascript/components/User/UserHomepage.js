import React, {useState, Component} from "react"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MuiAlert from '@mui/material/Alert';
import CategoryFilter from "../Filter/CategoryFilter";
import Button from "@mui/material/Button";
import LocationFilter from "../Filter/LocationFilter";
import IsPaidFilter from "../Filter/IsPaidFilter";

import {UsStates, getCities} from '../../utils/FormsUtils';

import Header from "../Navbar/Header";

const commonStyle = {marginTop: "20px", marginBottom: "20px"}

class UserHomepage extends Component {
    constructor(props) {
        super(props)
        
        const submittedTableData = properties.submittedTableData || []
        const eventDeletedFlag = submittedTableData.find((event)=>{
            if(event.status === 'DELETED'){
                let currTime = new Date();
                let updatedTime = new Date(event.delete_time);
                return (currTime.getTime() - updatedTime.getTime())/(1000 * 3600 * 24) <7;
            }
        }) 

        this.state = {
            acceptingTableData: properties.acceptingTableData ? properties.acceptingTableData : [],
            submittedTableData: properties.submittedTableData ? properties.submittedTableData : [],
            eventDeletedFlag,
            tabValue: 0,
            categoryFilterTextValue: 'All', 
            stateName: '', 
            cityName: '', 
            filteredTableData: properties.acceptingTableData ? properties.acceptingTableData : [], 
            isPaidFilterValue: 'None'
        }
    }
    
    handleTabChange = (event, value) => {
        this.setState({
            tabValue: value
        })
    }
    
    handleLocationFilterChange = (stateName, cityName) =>{
        this.setState({
            stateName,
            cityName
        })
    }

    onSubmit = () => {
        let tableDataCopy = this.state.acceptingTableData;
        
        // Category Based Filtering
        let categoryFilterValues = tableDataCopy.filter((event) => this.state.categoryFilterTextValue === 'All' ? true: this.state.categoryFilterTextValue === event.category)
        
        let finalFilterValues = categoryFilterValues
        let stateFilterValues = null
        let cityFilterValues = null
        
        // State Based Filtering
        if(this.state.stateName) {
            stateFilterValues = categoryFilterValues.filter((event) => {
                return event.statename === this.state.stateName
            })
            finalFilterValues = stateFilterValues
        }
        
        // City Based Filtering
        if(this.state.cityName) {
            cityFilterValues = stateFilterValues.filter((event) => {
                return event.location === this.state.cityName
            })
            finalFilterValues = cityFilterValues
        } else {
            if(stateFilterValues) {
                finalFilterValues = stateFilterValues
            } else {
                finalFilterValues = categoryFilterValues
            }
        }
        
        // IsPaid Based Filtering
        finalFilterValues = finalFilterValues.filter((event) => this.state.isPaidFilterValue === 'None' ? true: this.state.isPaidFilterValue === event.ispaid)
        
        this.setState({
            filteredTableData: finalFilterValues
        })
    }

    
    onCategoryFilterValueSelected = (categoryFilterValue) =>{
        this.setState({
            categoryFilterTextValue: categoryFilterValue
        })
    }
    
    onIsPaidFilterSelected = (isPaidValue) =>{
        this.setState({
            isPaidFilterValue: isPaidValue
        })
    }
    
    renderAcceptingEventList() {
        const { acceptingTableData, filteredTableData } = this.state
        
        let rows = []
        if (!filteredTableData.length) {
            rows.push(
                 <TableRow key={0}>
                    <TableCell align="center">
                        No ongoing Events right now.
                    </TableCell>
                 </TableRow>
            )
        } else {
            filteredTableData.map((event, i) => {
                rows.push(
                    <TableRow key={i}>
                        <TableCell align="center" onClick={() => {window.location.href="/user/events/"+event.id}}>
                            <b><a href={"/user/events/" + event.id}>{event.title}</a></b>
                        </TableCell>
                        <TableCell align="center" onClick={() => {window.location.href="/user/events/"+event.id}}>
                            <b>{event.category}</b>
                        </TableCell>
                        <TableCell align="center" onClick={() => {window.location.href="/user/events/"+event.id}}>
                            <b>{new Date(event.date).toLocaleDateString()}</b>
                        </TableCell>
                        <TableCell align="center" onClick={() => {window.location.href="/user/events/"+event.id}}>
                            <b>{event.location + ", " + event.statename}</b>
                        </TableCell>
                        <TableCell align="center" onClick={() => {window.location.href="/user/events/"+event.id}}>
                            <b>{event.ispaid}</b>
                        </TableCell>
                    </TableRow>
                )
            });
        } 
        return rows;
    }
    
    renderSubmittedEventList(type) {
        const { submittedTableData, filteredTableData } = this.state
        
        let rows = []
        if (!filteredTableData.length) {
            rows.push(
                 <TableRow key={0}>
                    <TableCell colSpan={2} align="center">
                        No Events submitted to right now.
                    </TableCell>
                 </TableRow>
            )
        } else {
            filteredTableData.map((event, i) => {
                if (event.accepting) {
                    rows.push(
                        <TableRow key={i}>
                            <TableCell align="center" onClick={() => {window.location.href="/user/events/"+event.id}}>
                                <b><a href={"/user/events/" + event.id}>{event.title}</a></b>
                            </TableCell>
                            <TableCell align="center">
                                {event.status}
                            </TableCell>
                        </TableRow>
                    )
                } else {
                    rows.push(
                        <TableRow key={i}>
                            <TableCell align="center">
                                <b>{event.title}</b>
                            </TableCell>
                            <TableCell align="center">
                                {event.status}
                            </TableCell>
                        </TableRow>
                    )
                }
            });
        } 
        return rows;
    }

    render() {
        return(
            <div>
                <div>
                    <Header />
                </div>
                <div>
                    <div className="container user-events">
                        {
                            this.state.eventDeletedFlag ? <MuiAlert onClick={() => (this.setState({eventDeletedFlag: false}))} severity="warning" elevation={6} variant="filled">Note: Certain events have been cancelled. Please check submissions for more details. Sorry for the inconvenience.</MuiAlert> : null
                        }
                        <div className="row">
                            <h2> CastNXT Events </h2>
                        </div>
                        <div className="row">
                            <div className="col-md-6 offset-md-3">
                                <div>
                                    <Tabs variant="fullWidth" value={this.state.tabValue} onChange={this.handleTabChange} centered>
                                        <Tab style={{focus: "color: #719ECE"}} label="Events" />
                                        <Tab label="Submissions" />
                                    </Tabs>
                                    <hr style={{ color: "black" }} />
                                </div>
                                
                                <div><b>Category Filter</b></div>
                                <CategoryFilter categoryFilterValueSelected = {this.onCategoryFilterValueSelected}></CategoryFilter>
                                <LocationFilter handleLocationFilterChange = {this.handleLocationFilterChange}></LocationFilter>
                                <div><b>Is the event paid ?</b></div>
                                <IsPaidFilter isPaidFilterSelected = {this.onIsPaidFilterSelected}></IsPaidFilter>
                                <Button variant="outlined" onClick = {this.onSubmit} style={commonStyle}>Submit Filter</Button> 
                            
                                {this.state.tabValue === 0 &&
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableHead style={{ backgroundColor: "#3498DB" }}>
                                                <TableRow>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Event</TableCell>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Category</TableCell>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Date</TableCell>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Location</TableCell>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Is Paid?</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.renderAcceptingEventList()}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                }
                                
                                {this.state.tabValue === 1 &&
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableHead style={{ backgroundColor: "#3498DB" }}>
                                                <TableRow>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Event</TableCell>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.renderSubmittedEventList()}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserHomepage