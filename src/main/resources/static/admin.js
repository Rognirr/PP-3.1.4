let allUsers;
let allRoles;
fetch("rest/users")
    .then(response => {
            response.json().then(
                array => {
                    allUsers = array;
                    let userBody = "";
                    array.forEach(data => {
                            userBody += "<tr id=\"" + data.id + "\">";
                            userBody += "<td>" + data.id + "</td>";
                            userBody += "<td>" + data.name + "</td>";
                            userBody += "<td>" + data.lastName + "</td>";
                            userBody += "<td>" + data.age + "</td>";
                            userBody += "<td>" + data.email + "</td>";
                            userBody += "<td>";
                            let rolesName = "";
                            data.roles.forEach(r => {
                                rolesName += r.name + " ";
                            })
                            userBody += rolesName + "</td>";
                            userBody += "<td><button class=\"btn btn-info\" onclick=\"pressEdit(this)\" id=\"editBtn" + data.id + "\">Edit</button></td>";
                            userBody += "<td><button class=\"btn btn-danger\" onclick=\"pressDel(this)\" id=\"deleteBtn" + data.id + "\">Delete</button></td>" + "</tr>";
                        }
                    )
                    document.getElementById("tableAdminBody").innerHTML = userBody;
                }
            )
        }
    )

fetch("rest/roles")
    .then(response => {
            response.json().then(
                data => {
                    allRoles = data;
                    let selectOption = ""
                    document.getElementById("roleForm").size = data.length;
                    data.forEach(role => {
                        selectOption += "<option>" + role.name + "</option>";
                    })
                    document.getElementById("roleForm").innerHTML = selectOption;
                }
            )
        }
    )

function pressEdit(el) {
    let idStr = el.id;
    let id = idStr.slice(7);
    allUsers.forEach(user => {
            if (user.id == id) {
                // user1 = u;
                console.log(user);
                document.getElementById("idModalField").value = user.id;
                document.getElementById("firstNameModalField").value = user.name;
                document.getElementById("lastNameModalField").value = user.lastName;
                document.getElementById("ageModalField").value = user.age;
                document.getElementById("emailModalField").value = user.email;
                document.getElementById("roleModalForm").size = allRoles.length;
                let temp = "";
                allRoles.forEach(role => {
                    let select = "";
                    user.roles.forEach(rUser => {
                        if (rUser.id == role.id) {
                            select = " selected";
                        }
                    })
                    temp += "<option" + select + ">" + role.name + "</option>";
                })
                document.getElementById("roleModalForm").innerHTML = temp;
            }
        }
    );
    $('#editModal').modal('show');
}


function pressDel(el) {
    let idStr = el.id;
    let id = idStr.slice(9);
    allUsers.forEach(user => {
            if (user.id == id) {
                document.getElementById("idDelete").value = user.id;
                document.getElementById("firstNameDelete").value = user.name;
                document.getElementById("lastNameDelete").value = user.lastName;
                document.getElementById("ageDelete").value = user.age;
                document.getElementById("emailDelete").value = user.email;
                document.getElementById("roleDelete").size = user.roles.length.toString();
                let temp = "";
                user.roles.forEach(role => {
                    temp += "<option>" + role.name + "</option>";
                })
                document.getElementById("roleDelete").innerHTML = temp;
            }
        }
    );
    $('#deleteModal').modal('show');
}

$('#addUserBtn').click(function () {
        let newUser = {
            name: "",
            lastName: "",
            age: 0,
            email: "",
            password: "",
            roles: []
        };
        newUser.email = document.getElementById("emailField").value;
        if (!isHaveUser(newUser.email, 0)) {
            newUser.name = document.getElementById("firstNameField").value;
            newUser.lastName = document.getElementById("lastNameField").value;
            newUser.age = document.getElementById("ageField").value;
            newUser.password = document.getElementById("passwordField").value;
            newUser.roles = [];
            [].slice.call(document.getElementById("roleForm")).forEach(op => {
                if (op.selected) {
                    allRoles.forEach(role => {
                        if (role.name == op.text) {
                            newUser.roles.push(role);
                        }
                    })
                }
            })
            fetch('/rest/users', {
                method: 'POST',
                Accept: 'application/json, */*; q=0.01',
                body: JSON.stringify(newUser),
                headers: {'Content-Type': 'application/json'}
            }).then(response => {
                if (response.ok) {
                    response.json().then(u => {
                        allUsers.push(u);
                        createTable(allUsers);
                    })
                    document.getElementById("firstNameNew").value = "";
                    document.getElementById("lastNameNew").value = "";
                    document.getElementById("emailNew").value = "";
                    document.getElementById("passwordNew").value = "";
                    document.getElementById("rolesNew").selectedIndex = -1;
                } else {
                    alert("Не удалось добавить: " + response.status);
                }
            })
        }
    }
)

function createTable(data) {
    let temp = "";
    data.forEach(user => {
        temp += "<tr id=\"" + user.id + "\">";
        temp += "<td>" + user.id + "</td>";
        temp += "<td>" + user.name + "</td>";
        temp += "<td>" + user.lastName + "</td>";
        temp += "<td>" + user.age + "</td>";
        temp += "<td>" + user.email + "</td>";
        temp += "<td>";
        let rolesStr = "";
        user.roles.forEach(role => {
            rolesStr += role.name + " ";
        })
        temp += rolesStr + "</td>";
        temp += "<td><button class=\"btn btn-info\" onclick=\"pressEdit(this)\" id=\"editBtn" + user.id + "\">Edit</button></td>";
        temp += "<td><button class=\"btn btn-danger\" onclick=\"pressDel(this)\" id=\"deleteBtn" + user.id + "\">Delete</button></td>" + "</tr>";
    })
    document.getElementById("tableAdminBody").innerHTML = temp;
}

function isHaveUser(email, id) {
    let result = false;
    allUsers.forEach(user => {
        if (user.email === email) {
            if (user.id != id) {
                result = true;
                alert("Пользователь с таким email уже существует!");
            }
        }
    })
    return result;
}

$('#delUserBtn').click(function () {
        let id = document.getElementById("idDelete").value;
        $('#deleteModal').modal('hide');

        fetch('/rest/users/' + id, {method: 'DELETE'})
            .then(response => {
                if (response.ok) {
                    document.getElementById(id).remove();
                    let u = getUserById(id);
                    let i = allUsers.indexOf(u);
                    delete allUsers[i];
                } else {
                    alert("Удаление не удалось: " + response.status);
                }
            });
    }
)

function getUserById(id) {
    let t = null;
    allUsers.forEach(user => {
        if (user.id == id) {
            t = user;
        }
    })
    return t;
}

$('#editUserBtn').click(function () {
        let edit = {
            id: -1,
            name: "",
            lastName: "",
            age: 0,
            email: "",
            password: "",
            roles: []
        };
        edit.email = document.getElementById("emailModalField").value;
        edit.id = document.getElementById("idModalField").value;
        if (!isHaveUser(edit.email, edit.id)) {
            $('#editModal').modal('hide');
            edit.name = document.getElementById("firstNameModalField").value;
            edit.lastName = document.getElementById("lastNameModalField").value;
            edit.age = document.getElementById("ageModalField").value;
            edit.password = document.getElementById("passwordModalField").value;
            edit.roles = [];
            [].slice.call(document.getElementById("roleModalForm")).forEach(op => {
                if (op.selected) {
                    allRoles.forEach(role => {
                        if (role.name == op.text) {
                            edit.roles.push(role);
                        }
                    })
                }
            })
            fetch('/rest/users', {
                method: 'PUT',
                body: JSON.stringify(edit),
                headers: {'Content-Type': 'application/json'}
            })
                .then(response => {
                    if (response.ok) {
                        allUsers.forEach(user => {
                            if (user.id == edit.id) {
                                user.name = edit.name;
                                user.lastName = edit.lastName;
                                user.age = edit.age;
                                user.email = edit.email;
                                if (edit.password !== "") {
                                    user.password = edit.password;
                                }
                                user.roles = edit.roles;
                            }
                        })
                        createTable(allUsers);
                    }
                });
        }
    }
)