*** Settings ***
Library           SeleniumLibrary
Resource          ../resourceMainPage.robot
Resource          resourceWarehouseManagementPage.robot

*** Test Cases ***

Create And Confirm WM
    Login FranchiseStore
    Select MainPage Menu                                  Towary
    Select Warehouse Management From Header Menu
    Select Left Menu                                      Wydania magazynowe
    Click Create Internal Stock Out Document
    Select Type Of Document To Be Created                 Wydanie magazynowe WM / STRATA
    Document Should Open                                  WYDANIE MAGAZYNOWE WM / STRATY 
    Input Comments
    Input WD Doc Delivery                                 AutomaticWM
    Input Good Name In Article Line
    Select Article From Modal List                        2
    Input Quantity In Article Line
    Confirm Document
    Document Should Be Confirmed
    [Teardown]    Close Browser

Create And Confirm KWM
    Login FranchiseStore
    Select MainPage Menu                                  Towary
    Select Warehouse Management From Header Menu
    Select Left Menu                                      Wydania magazynowe
    Click Create Internal Stock Out Document
    Select Type Of Document To Be Created                 KOREKTA WYDANIA MAGAZYNOWEGO KWM / STRATY
    Document Should Open                                  KOREKTA WYDANIA MAGAZYNOWEGO KWM / STRATY 
    Input Comments
    Select Delivery Doc
    Document Should Open                                  KOREKTA WYDANIA MAGAZYNOWEGO KWM / STRATY
    Select From List Menu                                 Dodaj nową pozycję
    Select Article From List
    Document Should Open                                  KOREKTA WYDANIA MAGAZYNOWEGO KWM / STRATY
    Input Quantity In Article Line Correction Doc         0
    Confirm Document
    Document Should Be Confirmed
    [Teardown]    Close Browser

Create And Confirm KWM Without WM
    Login FranchiseStore
    Select MainPage Menu                                  Towary
    Select Warehouse Management From Header Menu
    Select Left Menu                                      Wydania magazynowe
    Click Create Internal Stock Out Document
    Select Type Of Document To Be Created                 Korekta wydania magazynowego KWM bez WM
    Document Should Open                                  KOREKTA WYDANIA MAGAZYNOWEGO KWM / STRATY
    Input Comments
    Input Good Name In Article Line
    Select Article From Modal List                        2
    Document Should Open                                  KOREKTA WYDANIA MAGAZYNOWEGO KWM / STRATY
    Input Quantity In Article Line                        
    Confirm Document
    Document Should Be Confirmed
    [Teardown]    Close Browser