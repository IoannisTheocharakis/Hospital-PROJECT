/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import com.google.gson.Gson;
import database.DB_Connection;
import database.tables.EditDoctorTable;
import database.tables.EditSimpleUserTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
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

public class SignIn extends HttpServlet {

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
            out.println("<title>Servlet SignIn</title>");            
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet SignIn at " + request.getParameter("firstname") + "</h1>");
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
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        




        
        try (PrintWriter out = response.getWriter()){
            EditDoctorTable dt = new EditDoctorTable();
            EditSimpleUserTable sut = new EditSimpleUserTable();


            if(dt.DoctorDataExist("email", request.getParameter("email")) || sut.SUDataExist("email", request.getParameter("email"))){
                out.println("Email");
                response.setStatus(403);

                return;
            }
            if(dt.DoctorDataExist("amka", request.getParameter("amka")) || sut.SUDataExist("amka", request.getParameter("amka"))){
                out.println("AMKA");
                response.setStatus(403);

                return;
            }
            if(dt.DoctorDataExist("username", request.getParameter("username")) || sut.SUDataExist("username", request.getParameter("username"))){
                out.println("Username");
                response.setStatus(403);

                return;
            }else{
                String UserOrDoctor = request.getParameter("type-user");
                if(UserOrDoctor.equals("user")){
                    SimpleUser user = new SimpleUser();
                
                    user.setFirstname(request.getParameter("firstname"));
                    user.setLastname(request.getParameter("lastname"));
                    user.setBirthdate(request.getParameter("birthdate"));
                    user.setUsername(request.getParameter("username"));
                    user.setEmail(request.getParameter("email"));
                    user.setPassword(request.getParameter("password"));
                    user.setGender(request.getParameter("gender"));
                    user.setAmka(request.getParameter("amka"));
                    user.setCountry(request.getParameter("country"));
                    user.setCity(request.getParameter("city"));
                    user.setAddress(request.getParameter("address"));
                    user.setLat(Double.parseDouble(request.getParameter("lat")));
                    user.setLon(Double.parseDouble(request.getParameter("lon")));
                    user.setHeight(Integer.parseInt(request.getParameter("height")));
                    user.setWeight(Double.parseDouble(request.getParameter("weight")));
                    user.setTelephone(request.getParameter("telephone"));
                    user.setBloodtype(request.getParameter("bloodtype"));
                    user.setBlooddonor(Integer.parseInt(request.getParameter("blooddonor")));
                    EditSimpleUserTable simpleuser= new EditSimpleUserTable();                
                    simpleuser.addNewSimpleUser(user);
System.out.println("SimpleUser");
                   out.println("SimpleUser");
                    response.setStatus(200);
                }else{
                    Doctor doc = new Doctor();
           
                    doc.setFirstname(request.getParameter("firstname"));
                    doc.setLastname(request.getParameter("lastname"));
                    doc.setBirthdate(request.getParameter("birthdate"));
                    doc.setUsername(request.getParameter("username"));
                    doc.setEmail(request.getParameter("email"));
                    doc.setPassword(request.getParameter("password"));
                    doc.setGender(request.getParameter("gender"));
                    doc.setAmka(request.getParameter("amka"));
                    doc.setCountry(request.getParameter("country"));
                    doc.setCity(request.getParameter("city"));
                    doc.setAddress(request.getParameter("address"));
                    doc.setLat(Double.parseDouble(request.getParameter("lat")));
                    doc.setLon(Double.parseDouble(request.getParameter("lon")));
                    doc.setHeight(Integer.parseInt(request.getParameter("height")));
                    doc.setWeight(Double.parseDouble(request.getParameter("weight")));
                    doc.setTelephone(request.getParameter("telephone"));
                    doc.setBloodtype(request.getParameter("bloodtype"));
                    doc.setBlooddonor(Integer.parseInt(request.getParameter("blooddonor")));
                    doc.setSpecialty(request.getParameter("specialty"));
                    doc.setCertified(0);
                    doc.setDoctor_info(request.getParameter("doctor_info"));
                
                    EditDoctorTable newDoctor = new EditDoctorTable();                
                    newDoctor.addNewDoctor(doc);
                    out.println("Doctor");
                    response.setStatus(200);
                }
            }
        } catch (SQLException ex) {
            Logger.getLogger(SignIn.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(SignIn.class.getName()).log(Level.SEVERE, null, ex);
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
