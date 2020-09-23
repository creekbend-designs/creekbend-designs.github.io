var xhr = new XMLHttpRequest();
xhr.open('GET', 'data/ASPS_Costs.xlsx', true);
/* xhr.responseType = "blob"; */
xhr.responseType = "arraybuffer";

xhr.onload = function(event) {
    /*
    var blob = xhr.response;
    ProcessExcel(blob);
    */
    var arraybuffer = xhr.response;
    
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
    
    ProcessExcel(bstr);
}

xhr.send();

var costs_tee;
var costs_fleece;
var description_tee;
var description_fleece;
var description_tanktop;
var costs;

function Upload() {
    
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("fileUpload");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            
            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
}; // Upload

function ProcessExcel(data) {

    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });
    
    // Process each sheet
    var mySheet;
    var sheetname;
    var objptr;
    for (var i = 0; i < workbook.SheetNames.length; i++) {
        sheetname = workbook.SheetNames[i];
        //console.log("Sheetname: " + sheetname);

        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetname]);
        var json_object = JSON.stringify(XL_row_object);
        //console.log(json_object);

        /*
        var obj = JSON.parse(json_object);
        console.log(obj);
        console.log(obj.length);
        */
        
        if (sheetname === 'Costs_Tee') {
            costs_tee = JSON.parse(json_object);
            //console.log(costs_tee);
        }
        else if (sheetname === 'Costs_Fleece') {
            costs_fleece = JSON.parse(json_object);
            //console.log(costs_fleece);
        }
        else if (sheetname === 'Description_Tee') {
            description_tee = JSON.parse(json_object);
            //console.log(description_tee);
        }
        else if (sheetname === 'Description_Fleece') {
            description_fleece = JSON.parse(json_object);
            //console.log(description_fleece);
        }
        else if (sheetname === 'Description_Tanktop') {
            description_tanktop = JSON.parse(json_object);
            //console.log(description_tanktop);
        }
        else if (sheetname === 'Costs') {
            costs = JSON.parse(json_object);
            //console.log(costs);
        }      
        
    } // for each sheet
    
    LoadValues('init');

}; // ProcessExcel


function LoadGarmentDesc() {
    var garmType = document.getElementById('garmentType').value;
    var obj;
    if (garmType === 'Fleece') {
        obj = description_fleece;
    }
    else if (garmType === 'Tanktop') {
        obj = description_tanktop;
    }
    else {
        obj = description_tee;
    }
    
    /* Get garmentDesc */
    var garmDesc = document.getElementById("garmentDesc");

    /* Remove old descriptions */
    var length = garmDesc.options.length;
    if (length !== 0) {
        for (var i = length-1; i >= 0; i--) {
            garmDesc.options[i] = null;
        }
    }
    
    /* Add in descriptions */
    garmDesc = document.getElementById('garmentDesc');
    var optSel = document.createElement("option");
    optSel.text = "SELECT...";
    optSel.value = "";
    garmDesc.add(optSel);

    for (var i = 0; i < obj.length; i++) {
        var option = document.createElement("option");
        option.text = obj[i].Description;
        option.value = obj[i].Cost;
        garmDesc.add(option);
    }
} // LoadGarmentDesc

function LoadValues(x) {
    
    if (x === 'init') {
        // Load minimum quantity
        document.getElementById('frontCnt').value = costs_tee[0].Min;
    
        LoadGarmentDesc();
    }
    
} // LoadValues

function runningTotal() {

    /* Must have description which includes the garment cost */
    var garmentDesc = document.getElementById("garmentDesc").value;
    if (garmentDesc === "")
        return false;

    /* Must have quantity which determines printing cost */
    let quantity = Number(document.getElementById("frontCnt").value);
    if (quantity === "")
        return false;
    
    /* Garment Type */
    let garmentType = document.getElementById("garmentType").value;
    //console.log("Garment Type: " + garmentType);

    /* Printing Cost */
    let primary_cost = 0;
    let secondary_cost = 0;
    let costobj;
    if (garmentType === 'Fleece')
        costobj = costs_fleece;
    else
        costobj = costs_tee;
    for (var i = 0; i < costobj.length; i++) {
        if ((quantity >= Number(costobj[i].Min)) && 
            ((typeof costobj[i].Max === 'undefined') || (quantity <= Number(costobj[i].Max)))) {
            primary_cost = costobj[i].Primary_Cost;
            secondary_cost = costobj[i].Secondary_Cost;
        }
    }
    //console.log("Primary Cost: " + primary_cost);
    //console.log("Secondary Cost: " + secondary_cost);
        
    /* Shipping and Markup */
    let markUp = Number(costs[0].Markup_Tee) + 1;
    let shipUp = Number(costs[0].Ship_Tee);
    if (garmentType === 'Fleece') {
        markUp = Number(costs[0].Markup_Fleece) + 1;
        shipUp = Number(costs[0].Ship_Fleece);
    }
    let shipFlat = Number(costs[0].Ship_Flat);
    //console.log("Mark Up: " + markUp);
    //console.log("Ship: " + shipUp);
    //console.log("Ship Flat: " + shipFlat);

    /* Screen Costs */
    let screenCost = costs[0].New_Screen;
    if (document.getElementById("reprint").checked === true)
        screenCost = costs[0].Reprint_Screen;
    //console.log("Screen Costs: " + screenCost);

    // For the first print use the primary cost. For all others use secondary
    let print_cost = primary_cost;

    /* Front */
    let frontSetup = "";
    let frontSetupT = 0;
    let frontPrc = "";
    let frontPrcT = 0;      
    let frontScrnCnt = Number(document.getElementById("frontScrnCnt").value);
    
    if (frontScrnCnt != 0) {
        frontSetup = "$" + screenCost + " * " + frontScrnCnt;
        frontSetupT = Number(screenCost) * frontScrnCnt;
        frontPrc = print_cost + " * " + quantity;
        frontPrcT = (Number(print_cost) * Number(quantity)).toFixed(2);
        print_cost = secondary_cost;
    }
    document.getElementById("frontSetup").value = frontSetup;
    document.getElementById("frontSetupT").value = "$" + frontSetupT;
    document.getElementById("frontPrc").value = frontPrc;
    document.getElementById("frontPrcT").value = "$" + frontPrcT;

    /* Back */
    let backSetup = "";
    let backSetupT = 0;
    let backPrc = "";
    let backPrcT = 0;      
    let backScrnCnt = Number(document.getElementById("backScrnCnt").value);
    
    if (backScrnCnt != 0) {
        backSetup = "$" + screenCost + " * " + backScrnCnt;
        backSetupT = Number(screenCost) * backScrnCnt;
        backPrc = print_cost + " * " + quantity;
        backPrcT = (Number(print_cost) * Number(quantity)).toFixed(2);
        print_cost = secondary_cost;
    }
    document.getElementById("backSetup").value = backSetup;
    document.getElementById("backSetupT").value = "$" + backSetupT;
    document.getElementById("backPrc").value = backPrc;
    document.getElementById("backPrcT").value = "$" + backPrcT;

    /* Right Sleeve */
    let rsSetup = "";
    let rsSetupT = 0;
    let rsPrc = "";
    let rsPrcT = 0;      
    let rsScrnCnt = Number(document.getElementById("rsScrnCnt").value);
    
    if (rsScrnCnt != 0) {
        rsSetup = "$" + screenCost + " * " + rsScrnCnt;
        rsSetupT = Number(screenCost) * rsScrnCnt;
        rsPrc = print_cost + " * " + quantity;
        rsPrcT = (Number(print_cost) * Number(quantity)).toFixed(2);
        print_cost = secondary_cost;
    }
    document.getElementById("rsSetup").value = rsSetup;
    document.getElementById("rsSetupT").value = "$" + rsSetupT;
    document.getElementById("rsPrc").value = rsPrc;
    document.getElementById("rsPrcT").value = "$" + rsPrcT;

    /* Left Sleeve */
    let lsSetup = "";
    let lsSetupT = 0;
    let lsPrc = "";
    let lsPrcT = 0;      
    let lsScrnCnt = Number(document.getElementById("lsScrnCnt").value);
    
    if (lsScrnCnt != 0) {
        lsSetup = "$" + screenCost + " * " + lsScrnCnt;
        lsSetupT = Number(screenCost) * lsScrnCnt;
        lsPrc = print_cost + " * " + quantity;
        lsPrcT = (Number(print_cost) * Number(quantity)).toFixed(2);
        print_cost = secondary_cost;
    }
    document.getElementById("lsSetup").value = lsSetup;
    document.getElementById("lsSetupT").value = "$" + lsSetupT;
    document.getElementById("lsPrc").value = lsPrc;
    document.getElementById("lsPrcT").value = "$" + lsPrcT;

    /* Tag */
    let tagSetup = "";
    let tagSetupT = 0;
    let tagPrc = "";
    let tagPrcT = 0;      
    let tagScrnCnt = Number(document.getElementById("tagScrnCnt").value);
    
    if (tagScrnCnt != 0) {
        tagSetup = "$" + screenCost + " * " + tagScrnCnt;
        tagSetupT = Number(screenCost) * tagScrnCnt;
        tagPrc = print_cost + " * " + quantity;
        tagPrcT = (Number(print_cost) * Number(quantity)).toFixed(2);
        print_cost = secondary_cost;
    }
    document.getElementById("tagSetup").value = tagSetup;
    document.getElementById("tagSetupT").value = "$" + tagSetupT;
    document.getElementById("tagPrc").value = tagPrc;
    document.getElementById("tagPrcT").value = "$" + tagPrcT;

    /* Other */
    let otherSetup = "";
    let otherSetupT = 0;
    let otherPrc = "";
    let otherPrcT = 0;      
    let otherScrnCnt = Number(document.getElementById("otherScrnCnt").value);
    
    if (otherScrnCnt != 0) {
        otherSetup = "$" + screenCost + " * " + otherScrnCnt;
        otherSetupT = Number(screenCost) * otherScrnCnt;
        otherPrc = print_cost + " * " + quantity;
        otherPrcT = (Number(print_cost) * Number(quantity)).toFixed(2);
        print_cost = secondary_cost;
    }
    document.getElementById("otherSetup").value = otherSetup;
    document.getElementById("otherSetupT").value = "$" + otherSetupT;
    document.getElementById("otherPrc").value = otherPrc;
    document.getElementById("otherPrcT").value = "$" + otherPrcT;

    let setupT = Number(frontSetupT) + Number(backSetupT) + Number(rsSetupT) + Number(lsSetupT) + Number(tagSetupT) + Number(otherSetupT);
    document.getElementById("setupT").value = "$" + setupT;
    document.getElementById("setupTa").value = "$" + setupT;

    let prtCstT = Number(frontPrcT) + Number(backPrcT) + Number(rsPrcT) + Number(lsPrcT) + Number(tagPrcT) + Number(otherPrcT);
    document.getElementById("prtCstT").value = "$" + prtCstT;
    document.getElementById("prtCstTa").value = "$" + prtCstT;

    /* Garment Cost - determined by Vendor */    
    document.getElementById("garmentCst").value = garmentDesc + " * " + markUp + " * " + quantity;
    let garmentCstT = (Number(garmentDesc) * Number(quantity) * markUp).toFixed(2);
    document.getElementById("garmentCstT").value = "$" + garmentCstT;

    
    document.getElementById("shipping").value = quantity + " * " + shipUp + " * $" + shipFlat;
    let shippingT = Number(quantity) * Number(shipUp) + Number(shipFlat);
    document.getElementById("shippingT").value = "$" + shippingT;


    /* Priority */    
    var isPriority = 0;
    var daydiff = 12;
    var dateneeded = document.getElementById('dateneeded').value;
    if (dateneeded !== "") {
        var daten  = new Date(dateneeded);
        var today = new Date();
        var datediff = daten.getTime() - today.getTime();
        //console.log(datediff);
        daydiff = datediff / (1000 * 3600 * 24);
        //console.log("Day diff: " + daydiff);
        if (daydiff < 10)
            isPriority = 1;
    }
        
    let priority = "";
    let priorityT = 0;
    if (isPriority) {
        priority = "(" + setupT + " + " + prtCstT + ") * " + costs[0].Priority_Percent + "%";
        priorityT = (Number(setupT) + Number(prtCstT)) *(Number(costs[0].Priority_Percent)/100);
    }
    document.getElementById("priority").value = priority; 
    document.getElementById("priorityT").value = "$" + priorityT;

    let totalT = (Number(setupT) + Number(prtCstT) + Number(shippingT) + Number(garmentCstT) + Number(priorityT)).toFixed(2);

    document.getElementById("total").value = "$" + totalT;
    document.getElementById("totalp").value = "$" + totalT;
    if (quantity !== 0) {
        let perGarmentT = (totalT/quantity).toFixed(2);
        document.getElementById("perGarmentT").value = "$" + perGarmentT;
        document.getElementById("ppg").value = "$" + perGarmentT + " / GARMENT";
    }
} // runningTotal