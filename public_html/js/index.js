var connToken = "CONFIG.CONNECTION_TOKEN";
var dbName = "COLLEGE-DB";
var relName = "PROJECT-TABLE";

// baseUrl, imlPartUrl, irlPartUrl come from jpdb-commons.js (already loaded globals)

var currentRecNo = null; // rec_no of the record currently loaded (needed for UPDATE)

// PAGE LOAD
$(document).ready(function () {
    resetData();
});

// getProject() - fired on "onchange" of Project ID
function getProject() {

    var idVal = $("#projectId").val().trim();

    if (idVal === "") {
        return;
    }

    var jsonObjStr = JSON.stringify({"Project-ID": idVal});
    var getReq = createGET_BY_KEYRequest(connToken, dbName, relName, jsonObjStr);

    $.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(getReq, baseUrl, irlPartUrl);
    $.ajaxSetup({async: true});

    if (resultObj && resultObj.status === 200) {
        // Record FOUND: load it, switch to Update mode
        var rec = resultObj.data.record;
        currentRecNo = resultObj.data.rec_no;

        $("#projectName").val(rec["Project-Name"]);
        $("#assignedTo").val(rec["Assigned-To"]);
        $("#assignmentDate").val(rec["Assignment-Date"]);
        $("#deadline").val(rec["Deadline"]);

        $("#projectId").prop("disabled", true);
        $("#projectName, #assignedTo, #assignmentDate, #deadline").prop("disabled", false);

        $("#save").prop("disabled", true);
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);

        setStamp("onfile");
        $("#projectName").focus();

    } else {
        // Record NOT FOUND: fresh entry, switch to Save mode
        currentRecNo = null;

        $("#projectName, #assignedTo, #assignmentDate, #deadline").val("");
        $("#projectName, #assignedTo, #assignmentDate, #deadline").prop("disabled", false);

        $("#save").prop("disabled", false);
        $("#update").prop("disabled", true);
        $("#reset").prop("disabled", false);

        setStamp("new");
        $("#projectName").focus();
    }
}

// validateFields() - all data-entry fields must be non-empty
  
function validateFields() {

    if ($("#projectName").val().trim() === "") {
        alert("Project Name is required.");
        $("#projectName").focus();
        return false;
    }
    if ($("#assignedTo").val().trim() === "") {
        alert("Assigned To is required.");
        $("#assignedTo").focus();
        return false;
    }
    if ($("#assignmentDate").val().trim() === "") {
        alert("Assignment Date is required.");
        $("#assignmentDate").focus();
        return false;
    }
    if ($("#deadline").val().trim() === "") {
        alert("Deadline is required.");
        $("#deadline").focus();
        return false;
    }
    return true;
}

// saveData() - Save button -> PUT (insert new record)
 
function saveData() {

    var idVal = $("#projectId").val().trim();
    if (idVal === "") {
        alert("Project ID is required.");
        $("#projectId").focus();
        return;
    }
    if (!validateFields()) {
        return;
    }

    var record = {
        "Project-ID": idVal,
        "Project-Name": $("#projectName").val().trim(),
        "Assigned-To": $("#assignedTo").val().trim(),
        "Assignment-Date": $("#assignmentDate").val(),
        "Deadline": $("#deadline").val()
    };

    var putReq = createPUTRequest(connToken, JSON.stringify(record), dbName, relName);

    $.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReq, baseUrl, imlPartUrl);
    $.ajaxSetup({async: true});

    if (resultObj && resultObj.status === 200) {
        setStamp("filed");
        alert("Project saved successfully!\n" + resultObj.message);
        resetData();
    } else {
        alert("Save failed: " + (resultObj ? resultObj.message : "Unknown error"));
    }
}

// updateData() - Update button -> UPDATE (existing record)
   
function updateData() {

    if (currentRecNo === null) {
        alert("No record loaded to update. Please re-enter the Project ID.");
        return;
    }
    if (!validateFields()) {
        return;
    }

    var updatedFields = {
        "Project-Name": $("#projectName").val().trim(),
        "Assigned-To": $("#assignedTo").val().trim(),
        "Assignment-Date": $("#assignmentDate").val(),
        "Deadline": $("#deadline").val()
    };

    var updateReq = createUPDATERecordRequest(
        connToken,
        JSON.stringify(updatedFields),
        dbName,
        relName,
        currentRecNo
    );

    $.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(updateReq, baseUrl, imlPartUrl);
    $.ajaxSetup({async: true});

    if (resultObj && resultObj.status === 200) {
        setStamp("filed");
        alert("Project updated successfully!\n" + resultObj.message);
        resetData();
    } else {
        alert("Update failed: " + (resultObj ? resultObj.message : "Unknown error"));
    }
}

// resetData() - Reset button + initial page state
   
function resetData() {

    $("#projectForm")[0].reset();

    currentRecNo = null;

    $("#projectId").prop("disabled", false);
    $("#projectName, #assignedTo, #assignmentDate, #deadline").prop("disabled", true);

    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);

    setStamp("new");
    $("#projectId").focus();
}

// setStamp() - updates the visual status-stamp badge
  
function setStamp(state) {
    var stamp = $("#statusStamp");
    stamp.removeClass("stamp-new stamp-onfile stamp-filed");

    if (state === "onfile") {
        stamp.addClass("stamp-onfile").html('<span class="stamp-dot"></span>ON_FILE');
    } else if (state === "filed") {
        stamp.addClass("stamp-filed").html('<span class="stamp-dot"></span>FILED');
    } else {
        stamp.addClass("stamp-new").html('<span class="stamp-dot"></span>NEW_ENTRY');
    }
}