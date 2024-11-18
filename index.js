const express=require('express')
const path=require('path')
const app=express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'../client')))
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'../client/build','index.html'));
    });
var year = {
    '1': 0.85,
    '2': 0.8,
    '3': 0.76,
    '4': 0.75,
    '5': 0.71,
    '6': 0.68,
    '7': 0.65,
    '8': 0.633,
    '9': 0.612,
    '10': 0.587,
    '11': 0.573,
    '12': 0.553
}
var insurance = {
    '10': +0.02,
    '7': 0.016,
    '3': 0.012,
    '1': 0.007,
    '0': -0.05
}
var owner_number = {
    '1': 1.015,
    '2': 0.95,
    '3': 0.92,
    '4': 0.89,
    '5': 0.8823
}
var odometer_reading = {
    '5000': 0.022,
    '10000': 0.015,
    '20000': 0.01,
    '40000': -0.01,
    '70000': -0.025,
    '100000': -0.035,
    '150000': -0.055,
    '200000': -0.07,
    '300000': -0.08
}
var city_tier = {
    "1": 0.02,
    "2": 0.01,
    "3": -0.01
}
var fuel_type = {
    "Petrol": 0.01,
    "Diesel": -0.005
}
var transmission_type = {
    "Manual": 0.005,
    "Automatic": -0.005
}
var vehicle_category = {
    "Yes": -0.015,
    "No": 0
}
var year_ranges = {
    '1': [0, 2],
    '2': [2, 3],
    '3': [3, 4],
    '4': [4, 5],
    '5': [5, 6],
    '6': [6, 7],
    '7': [7, 8],
    '8': [8, 9],
    '9': [9, 10],
    '10': [10, 11],
    '11': [11, 12],
    '12': [12,Infinity]
}
var insurance_ranges = {
    '10': [10,13],
    '7': [7,10],
    '3': [3, 7],
    '1': [1, 3],
    '0': [0, 0.1]
}
var odometer_ranges = {
    '5000': [0, 5000],
    '10000':[5000,10000],
    '20000': [10000, 20000],
    '40000': [20000, 40000],
    '70000': [40000, 70000],
    '100000': [70000, 100000],
    '150000': [100000, 150000],
    '200000': [150000, 200000],
    '300000': [200000, Infinity],
}
function get_key_from_range(value,range){
    for(const key in range){
        const[low,high]=range[key];
        if(low<=value && value<high){
            return key;
        }
    }
return null;
}
app.post('/final-value',(req,res)=>{
    const data=req.body;
    const price=Number(data['price']);
    const age=Number(data['age']);
    const months=Number(data['months']);
    const owners=String(data['owners']);
    const odo_reading=Number(data['odo_reading']);
    const city=(String(data['city']));
    const fuel=(String(data['fuel']));
    const transmission=String(data['transmission']);
    const category=String(data['category']);
if(price=='' || age=='' || months=='' || owners=='' || odo_reading=='' || city=='' || fuel=='' || transmission=='' || category==''){
res.send("<html><body><h3>Fields cannot be empty</h3></body></html>")}
const age_key = get_key_from_range((age), year_ranges);
const months_key = get_key_from_range((months), insurance_ranges);
const odo_reading_key = get_key_from_range((odo_reading), odometer_ranges);
if (!age_key || !months_key || !odo_reading_key){
res.json("Invalid Input Ranges");
}
const reduced_value = price * year[age_key] * owner_number[owners];
const reduction_factor = (
    1 +
    insurance[months_key] +
    odometer_reading[odo_reading_key] +
    city_tier[city] +
    fuel_type[fuel] +
    transmission_type[transmission] +
    vehicle_category[category]
)
const final_value = Math.round(reduced_value * reduction_factor);
res.json({final_value});
});
app.listen(5000,()=>{
    console.log("Server running successfully");
});

