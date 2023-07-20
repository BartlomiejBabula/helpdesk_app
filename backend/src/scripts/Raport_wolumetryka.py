import cx_Oracle
import numpy as np
import sys
from openpyxl import load_workbook
from openpyxl.styles import Alignment
import os
from datetime import date, timedelta, datetime
from selenium import webdriver
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.common.by import By
import math

dbUser = str(sys.argv[1])
dbPassword = str(sys.argv[2])
dbIP = str(sys.argv[3])
dbPort = str(sys.argv[4])
dbSID = str(sys.argv[5])

print( dbUser, dbPassword, dbIP, dbPort, dbSID)
today = date.today()
dir_path = os.path.dirname(os.path.realpath(__file__))
wb = load_workbook(rf'/usr/src/app/src/scripts/RAPORT BAZY.xlsx')
sheet = wb['Obliczenia']
sheet2 = wb['Tabela']
cx_Oracle.init_oracle_client(lib_dir=r"/usr/src/app/src/oracle/instantclient_19_19")
conn = cx_Oracle.connect(f'{dbUser}/{dbPassword}@{dbIP}:{dbPort}/{dbSID}') 



# AKTYWNE SKLEPY

cursor = conn.cursor()
cursor.execute("select count(*) from es_stores where status ='A'")
active_shop = [_[0] for _ in list(cursor)]
sheet["F3"] = active_shop[0]
cursor.close()



# PRACA SYSTEMU

cursor = conn.cursor()
cursor.execute("alter session set nls_date_format = 'yyyy.mm.dd hh24:mi:ss'")
sql = """Select Sysdate, Name,Total_Mb,Free_Mb,Round(Free_Mb/Total_Mb*100,2) "%
Free" ,Round(100-(Free_Mb/Total_Mb*100),2) "% Used" From V$asm_Diskgroup
Where Name In ('GRP_ARCH','GRP_DATA')"""
cursor.execute(sql)
server_size = list(cursor)
sheet['B16'] = server_size[1][2]/1024
sheet['B18'] = server_size[1][3]/1024
sheet['B17'] = (server_size[1][2]/1024) - (server_size[1][3]/1024)
cursor.close()



# WIELKOŚĆ BAZY

cursor = conn.cursor()
sql2 = """select
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 1) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 2) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 3) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 4) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 5) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 6) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 7) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 8) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 9) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 10) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 11) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 12) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 13) )),
 (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 14) ))
 from dual"""
cursor.execute(sql2)
server_size2 = list(cursor)
for i in range(0,14):
    sheet["A" + str(42 - i)] = (today - timedelta(i+1)).strftime("%Y.%m.%d")
    brak_d = 12736.59271
    sheet["B" + str(42 - i)] =  server_size2[0][i]
cursor.close()



# TABELA

cursor = conn.cursor()
cursor.execute("alter session set nls_date_format = 'yyyy.mm.dd hh24:mi:ss'")
sql = """select * from table( MONI_REPORT_DB_2WEE.report_DB_2Wee ( 14 ) )"""
cursor.execute(sql)
size_array = list(cursor)


e=5
summaryE = 0
summaryF = 0
summaryG = 0
summaryH = 0

for i in range(0,12):
    sheet2['E' + str(e)] = size_array[i][4]
    sheet2['F' + str(e)] = size_array[i][1]
    sheet2['G' + str(e)] = size_array[i][2]
    sheet2['H' + str(e)] = size_array[i][3]
    
    if size_array[i][5] >= 0 :
        sheet2['I' + str(e)] = "wzrost"
    else :
        sheet2['I' + str(e)] = "spadek"
    if sheet2['G' + str(e)].value <= 0:
        sheet2['G' + str(e)] = 0
    else :
        summaryG = summaryG + size_array[i][2]

    if sheet2['H' + str(e)].value <= 0:
        sheet2['H' + str(e)] = 0
    else :
        summaryH = summaryH + size_array[i][3]

    summaryE = summaryE + size_array[i][4]
    summaryF = summaryF + size_array[i][1]
    

    e = e + 1

sheet2['E17'] = summaryE
sheet2['F17'] = summaryF
sheet2['G17'] = summaryG
sheet2['H17'] = summaryH

cursor.close()




#ZABBIX - webscraping

url_zabbix_WS = [25515, 25617, 25719, 25821]

options = FirefoxOptions()
options.add_argument("--headless")
driver = webdriver.Firefox(options=options)
driver.get('http://10.17.140.112:20080/zabbix/index.php')
driver.find_element("name", "name").send_keys('skghd')
driver.find_element("name",'password').send_keys('niepamientam')
driver.find_element("name",'enter').click()


for ws_server in url_zabbix_WS:
    day_back = 7
    week_array =[]
    for i in range(0,7): 
        zabbix_data = today - timedelta(day_back)
        if day_back == 7:
            hour = int(datetime.now().strftime("%H")) + 1
        else:
            hour = 00
        current_date = int(datetime.now().strftime("%Y%m%d%H%M") + '00')
        day_best_score = 0
        hours_left = 24 - hour
        for e in range(0, hours_left):
            if hour < 10:
                url_mod = int(zabbix_data.strftime("%Y%m%d") +'0' + str(hour) + '0000')
            else:
                url_mod = int(zabbix_data.strftime("%Y%m%d") + str(hour) + '0000')
            if hour < 24:
                hour = hour + 1
            if hour == 24:
                hour = 00
            if url_mod >= current_date:
                break

            url = f'http://10.17.140.112:20080/zabbix/history.php?action=showvalues&itemid={ws_server}&sid=8cef752df8f4c0cd&stime={url_mod}&period=3600'
            driver.get(url)
            driver.find_element("name",'plaintext').click()
            url_arrey = driver.find_element(By.CSS_SELECTOR, 'pre').text.split('\n')
            arrey_len = len(url_arrey)
            value_arrey = []
            for i in range(0, arrey_len) :
                value_arrey.append(url_arrey[i][31:])
                i = i + 1

            arrey_float = np.array(value_arrey, np.float16)
            if day_best_score < math.ceil(np.mean(arrey_float)):
                day_best_score = math.ceil(np.mean(arrey_float))


        week_array.append([zabbix_data.strftime("%d.%m.%Y"), day_best_score])
        day_back = day_back - 1
    mean_array = []
    e = 5
    for i in range(0, 7):
        sheet["A" + str(e)] = week_array[i][0]
        sheet["A" + str(e)].alignment = Alignment(horizontal='left')
        if ws_server == 25515 :
            sheet["B" + str(e)] = week_array[i][1]
            sheet["B" + str(e)].alignment = Alignment(horizontal='left')
        if ws_server == 25617 :
            sheet["C" + str(e)] = week_array[i][1]
            sheet["C" + str(e)].alignment = Alignment(horizontal='left')
        if ws_server == 25719 :
            sheet["D" + str(e)] = week_array[i][1]
            sheet["D" + str(e)].alignment = Alignment(horizontal='left')
        if ws_server == 25821 :
            sheet["E" + str(e)] = week_array[i][1]
            sheet["E" + str(e)].alignment = Alignment(horizontal='left')
        sheet["F" + str(e)] = (sheet["B" + str(e)].value + sheet["C" + str(e)].value + sheet["D" + str(e)].value + sheet["E" + str(e)].value)/4
        mean_array.append(sheet["F" + str(e)].value)
        e = e + 1


for i in range(0,3):
    if mean_array[i] < np.mean(mean_array)/3:
        mean_array[i] = 0
    sheet["F13"] = np.mean(mean_array)
    sheet["F14"] = np.mean(mean_array)/sheet["F3"].value
    sheet["G3"] = 90/sheet["F14"].value
    sheet["H3"] = sheet["G3"].value/4
    sheet2['J17'] = sheet2["G17"].value/1024
    sheet["B19"] = sheet2['J17'].value
    sheet["B20"] = sheet['B18'].value/sheet['B19'].value


# ZAPIS 

wb.save(rf'/usr/src/app/src/scripts/Wolumetryka.xlsx')
wb.close()

