*** Settings ***
Library           SeleniumLibrary

*** Variables ***

${SCANNER FILE}    /usr/src/app/src/selenium/ScannerFiles/order_scanner.txt
${ORDER FILE}      /usr/src/app/src/selenium/ScannerFiles/order_file.txt


*** Keywords ***

Click Prepare Orders Button
    Wait Until Page Contains Element    xpath: //*[contains(text(), "Przygotuj zamówienie")]    timeout=60s
    Click Element                       xpath: //*[contains(text(), "Przygotuj zamówienie")]

Click Order Assortment Button
    Wait Until Page Contains Element    xpath: //*[contains(text(), "+ Uzupełnij asortyment")]    timeout=60s
    Click Element                       xpath: //*[contains(text(), "+ Uzupełnij asortyment")]

Click Order From Scanner Or File
    Wait Until Page Contains Element    xpath: //*[contains(text(), "Zamów ze skanera lub pliku")]   timeout=60s
    Click Element                       xpath: //*[contains(text(), "Zamów ze skanera lub pliku")] 

Click Send Order From Scanner Button
    Wait Until Page Contains Element    xpath: //*[contains(text(), "Prześlij plik ze skanera")]    timeout=60s
    Click Element                       xpath://*[contains(text(), "Prześlij plik ze skanera")]

Click Send Order From File Button
    Wait Until Page Contains Element    xpath: //*[contains(text(), "Wczytaj plik (xlsx, xls,txt,csv)")]    timeout=60s
    Click Element                       xpath://*[contains(text(), "Wczytaj plik (xlsx, xls,txt,csv)")]

Select File From Scanner
    Wait Until Page Contains Element    xpath:.//span[2]/div[3]/table/tbody/tr/td[2]/div/span/select    
    Select From List By Value           xpath:.//span[2]/div[3]/table/tbody/tr/td[2]/div/span/select    0
    Wait Until Page Contains Element    class:ml1    
    Input Text                          class:ml1    ${SCANNER_FILE}

Select File 
    Wait Until Page Contains Element    class:ml1    
    Input Text                          class:ml1    ${ORDER_FILE}

Click Submit Button 
    Click Element                       xpath://*[@value="Zatwierdź"]
    Wait Until Page Contains Element    xpath://*[@value="Uruchom Zadanie"]    timeout=10s
    Click Element                       xpath://*[@value="Uruchom Zadanie"]
    Wait Until Page Contains Element    xpath://*[contains(text(), "Lista zadań w toku")]   
    Wait Until Page Contains Element    xpath://*[@value="Zamknij"]    timeout=60s
    Click Element                       xpath://*[@value="Zamknij"]

Click Close Button
    Wait Until Page Contains Element    xpath://*[@value="Zamknij"]    timeout=10s
    Click Element                       xpath://*[@value="Zamknij"]

Orders From Scanner Should Be Open
    Wait Until Page Contains Element    xpath: //*[contains(text(), "ZAMÓWIENIE - DOSTĘPNE PLIKI SKANERA")]    timeout=60s
    
Prepare Order From First Scanner File
    Click Element                       xpath://tr[1]//*[@title='Dodaj nowe zamówienie z pliku skanera']
    Wait Until Page Contains Element    xpath://*[@value="Zatwierdź"]   timeout=30s
    Click Element                       xpath://*[@value="Zatwierdź"]

Click Send Order
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage
    TRY
        Execute Javascript              document.evaluate(`//*[contains(text(), "Złóż zamówienie")]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute("style", "z-index:1000; position:absolute;");
    EXCEPT
        Sleep        1s
    END
    Wait Until Page Contains Element    xpath: //*[contains(text(), "Złóż zamówienie")]    timeout=30s
    Sleep                               1s
    Click Element                       xpath: //*[contains(text(), "Złóż zamówienie")]

Click Execute Button
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage
    Mouse Over                          xpath: //*[contains(@class, "btnOk")]  
    WHILE    True    limit=5
    TRY
        Click Element                   xpath: //*[contains(@class, "btnOk")]
        BREAK
    EXCEPT
        TRY
            Click Element               xpath: //*[contains(@class, "btnOk ui-button ui-widget ui-state-default ui-corner-all")]
            BREAK
        EXCEPT
            Sleep    0.5s   
        END 
        END
    END

Orders Desktop Should Be Open
    Wait Until Page Contains Element    xpath: //*[contains(text(), "+ Uzupełnij asortyment")]    timeout=60s

Order From File Should Be Sent
    Wait Until Page Does Not Contain Element    //table/tbody/tr/td[6]/div/input    timeout=30s

Orders Menu Page Should Be Open
    [Arguments]    ${title}  
    Wait Until Page Contains Element    xpath: //*[contains(text(), "${title}")]    timeout=360s

Enter To Order From List
    [Arguments]    ${element}=1
    Wait Until Page Contains Element    xpath: //table/tbody/tr[${element}]/td[3]/div    timeout=60s
    Double Click Element                xpath: //table/tbody/tr[${element}]/td[3]/div

Select First Document From List
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage
    Wait Until Page Contains Element    xpath: //tbody/tr[1]/td[1]/div/input    timeout=60s
    Click Element                       xpath: //tbody/tr[1]/td[1]/div/input

Input Amount Of First Article
    [Arguments]    ${amount}
    Wait Until Element Is Not Visible   class: blockUI blockMsg blockPage
    Wait Until Element Is Visible       xpath: //tr[1]/td[6]/div/input    timeout=60s 
    Input Text                          xpath: //tr[1]/td[6]/div/input   ${amount}
    

Select Operation From List Menu
    [Arguments]    ${operation}
    Select From List By Value           xpath: //div[2]/select    ${operation}

Save And Exit Order
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage
    Click Element                       xpath: //*[contains(text(), "Zapisz zmiany i wyjdź")]

Select Supplier
    [Arguments]    ${supplier}=Firma kogucik
    Wait Until Page Contains Element    xpath: //*[contains(@id, "select2-chosen-3")]    timeout=60s
    Wait Until Element Is Visible       xpath: //*[contains(@id, "select2-chosen-3")]    timeout=60s
    Click Element                       xpath: //*[contains(@id, "select2-chosen-3")]
    Sleep    1s
    Input Text                          xpath: //input[contains(@id, "autogen3_search")]   ${supplier}
    Wait Until Element Is Visible       xpath: //*[contains(text(), "Firma kogucik")]
    Click Element                       xpath: //*[contains(text(), "Firma kogucik")]
    Sleep    1s

Select Obligatory Assortment CheckBox
    Wait Until Page Contains Element    xpath: //input[contains(@class, "ObligatoryAssortment")]   timeout=60s
    Click Element                       xpath: //input[contains(@class, "ObligatoryAssortment")] 
    Sleep    1s

    
