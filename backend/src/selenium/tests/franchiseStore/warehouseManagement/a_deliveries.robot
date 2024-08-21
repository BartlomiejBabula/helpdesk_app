*** Settings ***
Library           SeleniumLibrary
Resource          ../resourceMainPage.robot
Resource          resourceWarehouseManagementPage.robot

 
*** Test Cases ***

Create And Confirm PZ Without Delivery
    Login FranchiseStore
    Select MainPage Menu                                  Towary
    Select Warehouse Management From Header Menu
    Click Create Delivery Document
    Select Type Of Document To Be Created                 PZ bez zamówienia
    Document Should Open
    Input PZ Doc Delivery                                 AutoDoc
    Input Comments                                
    Input Doc Supplier
    Input Good Name In Article Line                       75958
    Input Supplier Quantity In Article Line               5
    Input Good Name In Article Line                       249855   2
    Input Supplier Quantity In Article Line               2        2
    Confirm Document
    Document Should Be Confirmed
    [Teardown]    Close Browser

Create And Confirm KPZ
    Login FranchiseStore
    Select MainPage Menu                                  Towary
    Select Warehouse Management From Header Menu
    Click Create Delivery Document
    Select Type Of Document To Be Created                 Korektę KPZ
    Document Should Open                                  KOREKTA KPZ
    Input KPZ Doc Delivery
    Input Doc Data
    Input Doc Supplier
    Select Delivery Doc                                   1
    Document Should Open                                  KOREKTA KPZ
    Input Comments
    Select From List Menu                                 Pokaż pozycje
    Select Article From List
    Input Quantity In Article Line Correction Doc         0
    Confirm Document
    Document Should Be Confirmed
    [Teardown]    Close Browser

Create And Confirm PZZ
    Login FranchiseStore
    Select MainPage Menu                                  Towary
    Select Warehouse Management From Header Menu
    Click Create Delivery Document
    Select Type Of Document To Be Created                 PZZ
    Document Should Open                                  PRZYJĘCIE ZEWNĘTRZNE PZZ
    Input PZZ Doc Delivery
    Input Doc Data
    Input Comments
    Input Doc Supplier                                    CHAMPION - WARZYWA
    Input Good Name In Article Line                       ZIEMNIAKI LUZ
    Input Supplier Quantity In Article Line               9
    Confirm Document
    Document Should Be Confirmed
    [Teardown]    Close Browser


