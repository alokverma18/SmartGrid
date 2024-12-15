from config import mysql
import pymysql

def check():
    try:
        conn = mysql.connect()
        print(conn)
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("select * from employee")
        vehicleRow = cursor.fetchall()
        print(vehicleRow)
    except Exception as err:
        print(err)
check()