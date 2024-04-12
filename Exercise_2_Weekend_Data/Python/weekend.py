import os
import csv
from datetime import datetime

# I originally did this task in JavaScript and then converted it to Python so don't be too harsh guys!!!

# Path to weekend files folder
directory_path = './weekend_data_processing'
# Path to output combined CSV file
output_file_path = './combined_weekend_data/combined_weekend_data.csv'

# Check if files in weekend_data_processing folder are.csv files and present weekend days
# Return array of weekend days [Saturday, Sunday]
def get_weekend_days_file_names(directory_path):
    files = os.listdir(directory_path)
    # Filter out only the .csv files
    csv_files = [file for file in files if file.endswith('.csv')]
    # Get dates array
    dates = get_dates_from_array(csv_files)
    saturday = datetime.strptime(dates[0], '%Y-%m-%d').weekday() 
    sunday = datetime.strptime(dates[1], '%Y-%m-%d').weekday() 
    # Check if days are weekend days
    # Saturday = 5
    # Sunday = 6
    if saturday == 5 and sunday == 6:
        return csv_files
    else:
        print("Day's are not weekend days!!!")
        return []

# Helper function to extract date from
# file names, data_2023-02-11.csv => 2023-02-11 
def get_dates_from_array(array):
    dates = []
    for element in array:
        # Extract the date part from each element name
        date = element.split('_')[1].split('.')[0]
        dates.append(date)
    return dates

# read data from file
def read_csv(file_path):
    data = []
    with open(file_path, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)
    return data

def combine_weekend_data(directory_path):
    file_names = get_weekend_days_file_names(directory_path)
    if not file_names:
        return
    
    try:
        # Read data from Saturday and Sunday CSV files
        saturday_data = read_csv(os.path.join(directory_path, file_names[0]))
        sunday_data = read_csv(os.path.join(directory_path, file_names[1]))

         # Combine data
        combined_data = saturday_data + sunday_data
        
        current_date = datetime.now().strftime('%Y-%m-%d')
        # Add column for combined file generation date
        for row in combined_data:
            row['generation_date'] = current_date

        # Write combined data to output CSV file
        with open(output_file_path, 'w', newline='') as file:
            fieldnames = combined_data[0].keys()
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(combined_data)
        print('Combined weekend data written to', output_file_path)
    except Exception as e:
        print('Error combining weekend data:', e)



combine_weekend_data(directory_path)