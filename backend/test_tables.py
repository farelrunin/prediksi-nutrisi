import pymysql
conn = pymysql.connect(host='localhost', user='root', password='', database='nutriai_db')
cursor = conn.cursor()
cursor.execute('SHOW TABLES;')
tables = cursor.fetchall()
print('Tables:')
for table in tables:
    print(f'  - {table[0]}')
    
# Check users table structure
cursor.execute('DESC users;')
columns = cursor.fetchall()
print('\nUsers table columns:')
for col in columns:
    print(f'  {col[0]}: {col[1]}')
conn.close()
