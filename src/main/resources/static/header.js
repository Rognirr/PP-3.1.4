fetch("rest/user")
    .then(response => {
            response.json().then(
                data => {
                    let header = "";
                    let rolesName = "";
                    data.roles.forEach(r => {
                        rolesName += r.name + " ";
                    })
                    header = data.email + " with roles " + rolesName;
                    document.getElementById("headerFragment").innerHTML = header;
                }
            )
        }
    )