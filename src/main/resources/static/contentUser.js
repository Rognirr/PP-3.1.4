fetch("rest/user")
    .then(response => {
            response.json().then(
                data => {
                    let tableBody = "";
                    tableBody += "<tr id=\"" + data.id + "\">";
                    tableBody += "<td>" + data.id + "</td>";
                    tableBody += "<td>" + data.name + "</td>";
                    tableBody += "<td>" + data.lastName + "</td>";
                    tableBody += "<td>" + data.age + "</td>";
                    tableBody += "<td>" + data.email + "</td>";
                    tableBody += "<td>";
                    let rolesName = "";
                    data.roles.forEach(r => {
                        rolesName += r.name + " ";
                    })
                    tableBody += rolesName + "</td>" + "</tr>";
                    document.getElementById("tableUserBody").innerHTML = tableBody;
                }
            )
        }
    )