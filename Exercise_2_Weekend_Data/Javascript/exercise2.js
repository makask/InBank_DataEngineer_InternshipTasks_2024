const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Path to weekend files folder
const directoryPath = './weekend_data_processing';
// Path to output combined CSV file
const outputFilePath = './combined_weekend_data/combined_weekend_data.csv';
const weekendDays = getWeekendDaysFileNames(directoryPath);

// Check if files represent weekend days
function getWeekendDaysFileNames(directoryPath){
    const files = fs.readdirSync(directoryPath);
    console.log(files);
    //Filter out only the .csv files
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    // Get dates array
    const dates = getDatesFromArray(csvFiles);
    let saturday = new Date(dates[0]).getDay();
    let sunday = new Date(dates[1]).getDay();
    // Check if days are weekend days
    // Saturday = 6
    // Sunday = 0
    if(saturday === 6 && sunday === 0){
         return csvFiles;   
    }else{
        console.log("Day's are not weekend days!!!");
    }
}

getWeekendDaysFileNames(directoryPath);

// Function to extract dates from array elements
function getDatesFromArray(array) {
    const dates = array.map((element) => {
        // Extract the date part from each element
        const date = element.split('_')[1].split('.')[0];
        return date;
    });
    return dates;
}

// Function to read CSV file
function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Function to combine data from Saturday and Sunday CSV files
async function combineWeekendData(directoryPath) {
    const fileNames = getWeekendDaysFileNames(directoryPath);
    try {
        // Read data from Saturday and Sunday CSV files
        const saturdayData = await readCSV(directoryPath + "/" + fileNames[0]);
        const sundayData = await readCSV(directoryPath + "/" + fileNames[1]);
        
        // Combine data
        const combinedData = [...saturdayData, ...sundayData];
        
        // Get current date in yyyy-mm-dd format
        const currentDate = new Date().toISOString().slice(0, 10); 
        // Add column for combined file generation date
        combinedData.forEach((row) => {
            row['generation_date'] = currentDate;
        });

        // Write combined data to output CSV file
        const csvWriter = createCsvWriter({
            path: outputFilePath,
            header: Object.keys(combinedData[0]).map((key) => ({ id: key, title: key }))
        });

        await csvWriter.writeRecords(combinedData);
        console.log('Combined weekend data written to', outputFilePath);
    } catch (error) {
        console.error('Error combining weekend data:', error);
    }
}

// Call function to combine weekend data
combineWeekendData(directoryPath);


