package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.service.RoleService;

@Controller
public class AdminController {

    private final RoleService roleService;

    public AdminController(RoleService roleService) {
        this.roleService = roleService;
        if (roleService.findAllRoles().isEmpty()) {
            roleService.save(new Role("ADMIN"));
            roleService.save(new Role("USER"));
        }
    }

    @GetMapping
    public String indexView() {
        return "index";
    }

    @GetMapping("/admin")
    public String userView() {
        return "admin";
    }
}