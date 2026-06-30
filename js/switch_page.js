
function goToMainPanelButton() {
    try {
        window.location.href = "html/mainPanel.html"
        console.log("zbs")
    } catch (error) {
        console.error('index.html cant go to main panel: ', error)
    }
}

function goToMainPanel() {
    try {
        window.location.href = "mainPanel.html"
        console.log("zbs")
    } catch (error) {
        console.error('index.html cant go to main panel: ', error)
    }
}

function goToAutentificationFirst() {
    try {
        window.location.href = "index.html"
        console.log("Autentification page is open")
    } catch (error) {
        console.error('Cant open autentification page', error)
    }
}

function goToAutentificationAside() {
    try {
        window.location.href = "../index.html"
        console.log("Autentification page is open")
    } catch (error) {
        console.error('Cant open autentification page', error)
    }
}

function goToAddNewUser() {
    try {
        window.location.href = "addNewUser.html"
        console.log("New users page is open")
    } catch (error) {
        console.error('Cant open new users page', error)
    }
}

function goToCalendarPDF() {
    try {
        window.location.href = "calendarPDF.html";
        console.log("Calendar page is open");
    } catch (error) {
        console.error('Cant open calendar page', error);
    }
}

function goToDeleteUser() {
    try {
        window.location.href = "deleteUser.html"
        console.log("Delete users page is open")
    } catch (error) {
        console.error('Cant open delete users page', error)
    }
}

function goToChangePassword() {
    try {
        window.location.href = "changePassword.html"
        console.log("Change password page is open")
    } catch (error) {
        console.error('Cant open change password page', error)
    }
}

function goToDeleteWorks() {
    try {
        window.location.href = "deleteWorks.html"
        console.log("Delete works page is open")
    } catch (error) {
        console.error('Cant open delete works page', error)
    }
}

function goToAddNewWorks() {
    try {
        window.location.href = "newWorks.html"
        console.log("New works page is open")
    } catch (error) {
        console.error('Cant open new works page', error)
    }
}

function goToEnterWorks() {
    try {
        window.location.href = "enterWorks.html";
        console.log("Enter works page is open");
    } catch (error) {
        console.log('Cant open enter works page', error);
    }
}

function goToEnterWorksAside() {
    try {
        wokrsMas = [];
        allDatesForWorks = [];
        localStorage.setItem('wokrsMas', '[]');
        localStorage.setItem('allDatesForWorks', '[]');
        window.location.href = "enterWorks.html";
    } catch (error) {
        console.log('Cant open enter works page', error);
    }
}

function goToCheckingAddedWorks() {
    try {
        window.location.href = "checkWorks.html";
        console.log("Check works page is open");
    } catch (error) {
        console.log('Cant open check works page', error);
    }
}
