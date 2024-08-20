*** Settings ***
Library           SeleniumLibrary
Resource          ../../resource.robot
Library           DateTime

*** Variables ***

${date} 

*** Keywords ***

Select Left Menu 
    [Arguments]    ${menu}=Zwroty
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //span[contains(text(), "${menu}")]    timeout=10s
    Click Element                       xpath: //span[contains(text(), "${menu}")]

Click Create Delivery Document
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //div[contains(@class, "DeliveryAccordionItem")]//a[contains(text(), "Utwórz nowy dokument")]    timeout=10s
    Click Element                       xpath: //div[contains(@class, "DeliveryAccordionItem")]//a[contains(text(), "Utwórz nowy dokument")]

Click Create Return Document
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //div[contains(@class, "RecoveryAccordionItem")]//a[contains(text(), "Utwórz nowy dokument")]    timeout=10s
    Click Element                       xpath: //div[contains(@class, "RecoveryAccordionItem")]//a[contains(text(), "Utwórz nowy dokument")]

Click Create Internal Stock Out Document
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //div[contains(@class, "StockOut")]//a[contains(text(), "Utwórz nowy dokument")]    timeout=10s
    Click Element                       xpath: //div[contains(@class, "StockOut")]//a[contains(text(), "Utwórz nowy dokument")]

Click Create Stock State Correction Document
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //div[contains(@class, "StockStateCorrection")]//a[contains(text(), "Utwórz nowy dokument")]   timeout=10s
    Click Element                       xpath: //div[contains(@class, "StockStateCorrection")]//a[contains(text(), "Utwórz nowy dokument")] 

Click Create Articles Exchange Document
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //div[contains(@class, "ArticlesExchange")]//a[contains(text(), "Utwórz nowy dokument")]   timeout=10s
    Click Element                       xpath: //div[contains(@class, "ArticlesExchange")]//a[contains(text(), "Utwórz nowy dokument")] 

Select Type Of Document To Be Created
    [Arguments]    ${menu}=PZ bez zamówienia
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //div[contains(@class, "Dialog")]//*[.= "${menu}"]    timeout=10s
    Click Element                       xpath: //div[contains(@class, "Dialog")]//*[.= "${menu}"]

Input PZ Doc Delivery
    [Arguments]    ${name}=AutomaticPZ
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Input Text                          xpath: //input[contains(@name, ":docDeliveryPZ:docDelivery:")]    ${name}

Input KPZ Doc Delivery
    [Arguments]    ${name}=AutomaticKPZ
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Input Text                          xpath: //input[contains(@name, ":docDelivery:docDelivery:")]    ${name}

Input WD Doc Delivery
    [Arguments]    ${name}=AutomaticWD
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Click Element                       xpath: //input[contains(@name, ":documentFields:protocolSymbol:")]
    Input Text                          xpath: //input[contains(@name, ":documentFields:protocolSymbol:")]    ${name} 

Input PZZ Doc Delivery
    [Arguments]    ${name}=AutomaticPZZ
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Input Text                          xpath: //input[contains(@name, ":deliveryPzz:docDelivery:")]    ${name}

Input Doc Supplier
    [Arguments]    ${supplier}=Firma kogucik
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Input Text                          xpath: //input[contains(@name, "supplier")]    ${supplier}
    Click Element                       xpath: //span[contains(@class, "search")]    

Input Comments
    [Arguments]    ${comments}=TestComments
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //input[contains(@name, "comments")]
    Click Element                       xpath: //input[contains(@name, "comments")]
    Input Text                          xpath: //input[contains(@name, "comments")]    ${comments}

Input Good Name In Article Line
    [Arguments]   ${article}=75958    ${line}=1
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //tbody//tr[${line}]/td[contains(@class, "nameOfGood")]//input
    Click Element                       xpath: //tbody//tr[${line}]/td[contains(@class, "nameOfGood")]//input
    Input Text                          xpath: //tbody//tr[${line}]/td[contains(@class, "nameOfGood")]//input    ${article}
    Click Element                       xpath: //tbody//tr[${line}]/td[contains(@class, "nameOfGood")]//td[2] 

Input Supplier Quantity In Article Line
    [Arguments]   ${quantity}=1    ${line}=1
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //tbody//tr[${line}]/td[contains(@class, "supplierQuantity")]//input
    Click Element                       xpath: //tbody//tr[${line}]/td[contains(@class, "supplierQuantity")]//input
    Input Text                          xpath: //tbody//tr[${line}]/td[contains(@class, "supplierQuantity")]//input    ${quantity}  

Input Quantity In Article Line Correction Doc
    [Arguments]   ${quantity}=1    ${line}=1
    ${currentLine}=    Set Variable    ${${line} * 2}
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //tbody//tr[2]/td[contains(@class, "quantity")]//input
    Click Element                       xpath: //tbody//tr[${currentLine}]/td[contains(@class, "quantity")]//input
    Input Text                          xpath: //tbody//tr[${currentLine}]/td[contains(@class, "quantity")]//input    ${quantity}    

Input Quantity In Article Line
    [Arguments]   ${quantity}=1    ${line}=1
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //tbody//tr[1]/td[contains(@class, "quantity")]//input
    Click Element                       xpath: //tbody//tr[${line}]/td[contains(@class, "quantity")]//input
    Input Text                          xpath: //tbody//tr[${line}]/td[contains(@class, "quantity")]//input    ${quantity}    

Input RefShpPrice In Article Line
    [Arguments]   ${refShpPrice}=1    ${line}=1
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //tbody//tr[1]/td[contains(@class, "refShpPrice")]//input
    Click Element                       xpath: //tbody//tr[${line}]/td[contains(@class, "refShpPrice")]//input
    Clear Element Text                  xpath: //tbody//tr[${line}]/td[contains(@class, "refShpPrice")]//input
    Input Text                          xpath: //tbody//tr[${line}]/td[contains(@class, "refShpPrice")]//input    ${refShpPrice}    
Confirm Document
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Click Element                       xpath: //*[contains(text(), "Zatwierdź")]
    TRY
        Click Element                   xpath: //*[contains(text(), "Zatwierdź")]
    EXCEPT
        Sleep    2s
    END                     
    Refresh Until Page Contains         xpath: //div[contains(@class, "window_header")]/*[contains(text(), "Zatwierdzone")] 
                 
Document Should Open
    [Arguments]    ${docName}=PRZYJĘCIE ZEWNĘTRZNE PZ
    Wait Until Page Contains Element    xpath: //*[contains(text(), "${docName}")]    timeout=30s

Document Should Be Confirmed
    Wait Until Page Contains Element    xpath: //div[contains(@class, "window_header")]/*[contains(text(), "Zatwierdzone")]      timeout=30s

Input Doc Data
    Click Element                       xpath: //table[2]/tbody/tr/td[2]/div/span/input[@class="hasDatepicker"]
    ${date} =    Get Current Date       result_format=%Y-%m-%d
    Input Text                          xpath: //table[2]/tbody/tr/td[2]/div/span/input[@class="hasDatepicker"]    ${date}
    Click Element                       xpath: //table[1]/tbody/tr/td[2]/div/span/input

Select Delivery Doc
    [Arguments]    ${element}=1
    Wait Until Element Is Visible       xpath: //table[1]/tbody/tr/td[3]/span[1]/a/span[1]
    Click Element                       xpath: //table[1]/tbody/tr/td[3]/span[1]/a/span[1]
    Wait Until Page Contains Element    xpath: //div[1]/span/div/table[contains(@class, "dataview")]/tbody/tr[${element}]/td[1]      timeout=10s
    Click Element                       xpath: //div[1]/span/div/table[contains(@class, "dataview")]/tbody/tr[${element}]/td[1]
     
Select From List Menu
    [Arguments]    ${selectedOperation}=Pokaż pozycje
    Click Element                       xpath: //a[contains(text(), "Operacje")]
    Click Element                       xpath: //*[contains(text(), "${selectedOperation}")]

Select Article From List
    [Arguments]    ${element}=1
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //span/table/tbody/tr[1]/td[1]/span/input      timeout=10s
    Click Element                       xpath: //span/table/tbody/tr[${element}]/td[1]/span/input
    Click Element                       xpath: //button[contains(text(), "Zatwierdź")]
   
Select Article From Modal List
    [Arguments]    ${element}=1
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Wait Until Page Contains Element    xpath: //div[contains(@class, "dialogContent")]//tbody/tr[${element}]/td[3]      timeout=10s
    Click Element                       xpath: //div[contains(@class, "dialogContent")]//tbody/tr[${element}]/td[3]

Select Tab Of Document
    [Arguments]    ${tab}=Przyjęcie
    Click Element                       xpath: //div[contains(@class, "tab")]//*[contains(text(), "${tab}")]
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s
    Sleep    1s

Click Recalculate
    Click Element                       xpath: //*[contains(text(), "Przelicz")]
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=60s