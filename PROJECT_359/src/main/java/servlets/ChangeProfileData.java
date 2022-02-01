/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import database.tables.EditDoctorTable;
import database.tables.EditSimpleUserTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Doctor;
import mainClasses.SimpleUser;

/**
 *
 * @author Theo
 */
public class ChangeProfileData extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet ChangeProfileData</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ChangeProfileData at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SimpleUser user = new SimpleUser();
        Doctor doctor = new Doctor();

        int isItUser = 0;

        String firstname = request.getParameter("firstname");
        String lastname = request.getParameter("lastname");
        String birthdate = request.getParameter("birthdate");
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String gender = request.getParameter("gender");
        String country = request.getParameter("country");
        String city = request.getParameter("city");
        String address = request.getParameter("address");

        int height = (Integer.parseInt(request.getParameter("height")));
        double weight = (Double.parseDouble(request.getParameter("weight")));
        String telephone = request.getParameter("telephone");
        String bloodtype = request.getParameter("bloodtype");
        int blooddonor = (Integer.parseInt(request.getParameter("blooddonor")));

        try (PrintWriter out = response.getWriter()) {

            EditSimpleUserTable simpleuser = new EditSimpleUserTable();
            EditDoctorTable EDT = new EditDoctorTable();
            if (simpleuser.SUDataExist("email", request.getParameter("email")) || EDT.DoctorDataExist("email", request.getParameter("email"))) {
                out.println("Email");
                response.setStatus(403);

                return;
            }
            isItUser = simpleuser.isUser(username);
//            System.out.println(username);
            if (isItUser != 0) {
                simpleuser.updateDataSimpleUser(username, email, password, firstname, lastname, birthdate, weight, gender, country, city, address, telephone, height, blooddonor, bloodtype);
                SimpleUser su = simpleuser.databaseToSimpleUserWithUsername(username);
                String json = simpleuser.simpleUserToJSON(su);
                out.println(json);
            } else {
                EDT.updateDoctor(username, email, password, firstname, lastname, birthdate, weight, gender, country, city, address, telephone, height, blooddonor, bloodtype);
                Doctor du = EDT.databaseToDoctorUsername(username);
                String json = EDT.doctorToJSON(du);
                out.println(json);
            }

            response.setStatus(200);
        } catch (SQLException ex) {
            Logger.getLogger(ChangeProfileData.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(ChangeProfileData.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
