import mysql.connector
from mysql.connector import Error
from typing import List, Dict

def create_connection(db_config: Dict):
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            print('Connected to MySQL database')
            return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None

def insert_data_in_batches(data: List[Dict], db_config: Dict, table_name: str, batch_size: int = 1000):
    connection = create_connection(db_config)
    if not connection:
        return

    try:
        cursor = connection.cursor()
        
        for i in range(0, len(data), batch_size):
            batch = data[i:i + batch_size]
            
            if table_name == 'parsed_urls':
                placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'] * len(batch))
                query = f'''INSERT IGNORE INTO {table_name} 
                          (href, username, password, protocol, host, port, hostname, pathname, search, hash, application)
                          VALUES {placeholders}'''
                
                values = []
                for item in batch:
                    values.extend([
                        item.get('href'), item.get('username'), item.get('password'),
                        item.get('protocol'), item.get('host'), item.get('port'),
                        item.get('hostname'), item.get('pathname'), item.get('search'),
                        item.get('hash'), item.get('application')
                    ])
            
            cursor.execute(query, values)
            connection.commit()
            print(f"Inserted batch of {len(batch)} records")

    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection closed")