import pymysql
try:
    conn = pymysql.connect(host='localhost', user='root', password='', database='nutriai_db', connect_timeout=5)
    print('MySQL Connection OK')
    conn.close()
except Exception as e:
    print(f'MySQL Error: {e}')
