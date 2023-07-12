*** Settings ***
Library           SeleniumLibrary
Resource          ../../resource.robot
Library           DateTime

*** Variables ***

${date} 

*** Keywords ***

Click Create Special Offer
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage
    Click Element                       xpath: //*[contains(text(), "Nowa promocja")]

Special Offer Should Be Open
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage
    Wait Until Page Contains Element    xpath: //*[contains(text(), "PROMOCJA")]    timeout=60s

Quantity Offer Should Be Open
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage
    Wait Until Page Contains Element    xpath: //span[contains(text(), "PRZECENA ILOŚCIOWA")]    timeout=60s

Select Left Menu 
    [Arguments]    ${menu}
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage
    Wait Until Page Contains Element    xpath: //span[contains(text(), "${menu}")]    timeout=10s
    Click Element                       xpath: //span[contains(text(), "${menu}")]
    
Input Offer Name
    [Arguments]    ${name}=AutomaticSpecialOffer
    Input Text                          xpath: //input[contains(@name, "name")]    ${name}

Input Description
    [Arguments]    ${description}=TestDescription
    Input Text                          xpath: //input[contains(@name, "description")]    ${description}

Input Offer Start Data
    Click Element                       xpath: //table[1]/tbody/tr/td[2]/div/span/input
    ${date} =    Get Current Date       result_format=%Y-%m-%d
    Input Text                          xpath: //table[1]/tbody/tr/td[2]/div/span/input    ${date}
    
Input Offer End Data
    Click Element                       xpath: //table[2]/tbody/tr/td[2]/div/span/input[@class="hasDatepicker"]
    ${date} =    Get Current Date       result_format=%Y-%m-%d    increment=+ 1 day
    Input Text                          xpath: //table[2]/tbody/tr/td[2]/div/span/input[@class="hasDatepicker"]    ${date}
    Click Element                       xpath: //table[1]/tbody/tr/td[2]/div/span/input

Input Article In Offer
    [Arguments]   ${article}
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage
    Wait Until Page Contains Element    xpath: //table/tbody/tr/td[1]/div/span/input    timeout=10s
    Input Text                          xpath: //table/tbody/tr/td[1]/div/span/input    ${article} 

Input Article Price In Special Offer
    [Arguments]   ${price}
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage   
    Wait Until Page Contains Element    xpath: //span/span/span/span/div/span/input    timeout=30s
    Input Text                          xpath: //span/span/span/span/div/span/input    ${price}      

Click Search Icon
    Click Element                       xpath: //*[@title=" Wybierz"] 

Activate Special Offer
    Click Element                       xpath: //*[contains(text(), "Zatwierdź")]
    Click Element                       xpath: //*[contains(text(), "Zatwierdź")]
    Wait Until Page Contains Element    xpath: //*[contains(@value, "Zatwierdź")]    timeout=10s
    Click Element                       xpath: //*[contains(@value, "Zatwierdź")]
    Wait Until Page Contains Element    xpath: //*[contains(@value, "Uruchom Zadanie")]    timeout=10s
    Click Element                       xpath: //*[contains(@value, "Uruchom Zadanie")]
    Refresh Until                       xpath: //*[contains(@class, "btnClose")]                     
   
Special offer Should Be Active
    Wait Until Page Contains Element    xpath: //*[contains(text(), "Aktywna")]    timeout=30s

Click Create New Quanitity Offer
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage
    Click Element                       xpath: //*[contains(text(), "Utwórz nowy dokument")]

Select From List Menu
    [Arguments]    ${selectedOperation}=Dodaj nową pozycję
    Click Element                       xpath: //a[contains(text(), "Operacje")]
    Click Element                       xpath: //*[contains(text(), "${selectedOperation}")]

Input Article Price In Quanitity Offer
    [Arguments]   ${price}
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage   
    Wait Until Page Contains Element    xpath: //tbody/tr/td[12]/span/span/span/span/div/span/input    timeout=30s
    Input Text                          xpath: //tbody/tr/td[12]/span/span/span/span/div/span/input    ${price} 

Input Article Quanitity In Quanitity Offer
    [Arguments]   ${quanitity}
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage   
    Wait Until Page Contains Element    xpath: //tbody/tr/td[15]/span/span/span/span/div/span/input    timeout=30s
    Input Text                          xpath: //tbody/tr/td[15]/span/span/span/span/div/span/input    ${quanitity} 

Confirm Quanitity Offer
    Click Element                       xpath: //*[contains(text(), "Zatwierdź")]
    Refresh Until                       xpath: //td/span[contains(text(), "Zatwierdzone")] 

Activate Quanitity Offer
    Click Element                       xpath: //*[contains(text(), "Aktywuj")]
    Refresh Until                       xpath: //td/span[contains(text(), "Aktywne")]  

Quanitity Offer Should Be Active
    Wait Until Page Contains Element    xpath: //td/span[contains(text(), "Aktywne")]     timeout=30s
     