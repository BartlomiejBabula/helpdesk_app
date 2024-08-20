*** Settings ***
Library           SeleniumLibrary
Resource          resourceOrders.robot
Resource          ../resourceMainPage.robot
Resource          ../resourceAssortmentPage.robot
Resource          ../../resource.robot
 
*** Test Cases ***

Prepare And Send Orders From Prepare Orders Bttn
    Login FranchiseStore
    Select MainPage Menu        Towary
    Select Supplier
    Click Prepare Orders Button
    Orders Menu Page Should Be Open    Zamówienia w przygotowaniu
    Enter To Order From List
    Input Amount Of First Article      2
    Click Send Order
    Click Execute Button
    Refresh Until
    Orders Menu Page Should Be Open    Zamówienia w przygotowaniu
    [Teardown]    Close Browser

Prepare And Send Orders From Orders Assortment Bttn
    Login FranchiseStore
    Select MainPage Menu        Towary
    Select Obligatory Assortment CheckBox
    Click Order Assortment Button
    No Orders Create Info
    Log    ${orders}
    IF  ${orders} == True 
        Orders Menu Page Should Be Open    Zamówienia w przygotowaniu
        Enter To Order From List
        Input Amount Of First Article      2
        Click Send Order
        Click Execute Button
        Refresh Until
        Orders Menu Page Should Be Open    Zamówienia w przygotowaniu
    END
    [Teardown]    Close Browser

Send Orders From Document
    Login FranchiseStore
    Select MainPage Menu               Towary
    Select Orders From Header Menu     
    Select Orders Menu                 W przygotowaniu
    Orders Menu Page Should Be Open    Zamówienia w przygotowaniu
    Enter To Order From List           1
    Input Amount Of First Article      2
    Click Send Order
    Click Execute Button
    Refresh Until
    Orders Menu Page Should Be Open    Zamówienia w przygotowaniu
    [Teardown]    Close Browser

Delete Orders From List
    Login FranchiseStore
    Select MainPage Menu               Towary
    Select Orders From Header Menu
    Select Orders Menu                 W przygotowaniu
    Orders Menu Page Should Be Open    Zamówienia w przygotowaniu
    Select First Document From List
    Select Operation From List Menu    delete
    Click Execute Button
    Refresh Until
    Orders Menu Page Should Be Open    Zamówienia w przygotowaniu
    [Teardown]    Close Browser

Send Order From Scanner
    Login FranchiseStore
    Select MainPage Menu               Towary
    Click Order From Scanner Or File
    Click Send Order From Scanner Button
    Select File From Scanner
    Click Submit Button 
    Orders From Scanner Should Be Open
    Prepare Order From First Scanner File
    Refresh Until                      //span/span[2]/div/table/tbody/tr/td[3]
    Click Send Order
    Click Execute Button
    Refresh Until
    Order From File Should Be Sent
    [Teardown]    Close Browser

Send Order From File
    Login FranchiseStore
    Select MainPage Menu               Towary
    Click Order From Scanner Or File
    Click Send Order From File Button
    Select File
    Click Submit Button 
    Orders From Scanner Should Be Open
    Prepare Order From First Scanner File
    Refresh Until                      //span/span[2]/div/table/tbody/tr/td[3]
    Click Send Order
    Click Execute Button
    Refresh Until
    Order From File Should Be Sent
    [Teardown]    Close Browser
    
    
Send Order From Cart
    Login FranchiseStore
    Select MainPage Menu               Towary
    Select Assortment From Header Menu
    Assortment Page Should Be Open
    Input Article                      230974
    Click Search Article Button From Menu
    Article Should Be Found
    Enter First Article From List
    Article Cart Should Be Open
    Click Add To Cart Button
    Close Info Alert
    Select Cart From Header
    Cart Page Should Be Open
    Select From Cart List Menu        Utwórz zamówienie
    Click Confirm Button
    Input Amount Of First Article      3
    Click Send Order
    Click Execute Button
    Refresh Until
    Article Cart Should Be Open
    [Teardown]    Close Browser
