/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import database.tables.EditDoctorTable;
import database.tables.EditRandevouzTable;
import database.tables.EditSimpleUserTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Randevouz;

/**
 *
 * @author Theo
 */
public class ReturnDocUserForMSG extends HttpServlet {

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
            out.println("<title>Servlet ReturnDocUserForMSG</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ReturnDocUserForMSG at " + request.getContextPath() + "</h1>");
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
        String type = request.getParameter("type");

        EditRandevouzTable rd = new EditRandevouzTable();

        if (type.equals("doc")) {

            int doctor_id = (Integer.parseInt(request.getParameter("doctor_id")));
            ArrayList<Randevouz> all_rd = new ArrayList();
            try (PrintWriter out = response.getWriter()) {
                all_rd = rd.databaseToRandevouzs(doctor_id);
                if (all_rd.isEmpty()) {
                    response.setStatus(403);
                } else {
                    GsonBuilder gsonBuilder = new GsonBuilder();
                    Gson gson = gsonBuilder.create();
                    String rddoc = gson.toJson(all_rd);
                    out.println(rddoc);
                    response.setStatus(200);
                }
            } catch (SQLException ex) {
                Logger.getLogger(ReturnDocUserForMSG.class.getName()).log(Level.SEVERE, null, ex);
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ReturnDocUserForMSG.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else {
            int user_id = (Integer.parseInt(request.getParameter("user_id")));
            ArrayList<Randevouz> all_rd = new ArrayList();
            try (PrintWriter out = response.getWriter()) {
                all_rd = rd.databaseToUserRandevouzs(user_id);
                if (all_rd.isEmpty()) {
                    response.setStatus(403);
                } else {
                    GsonBuilder gsonBuilder = new GsonBuilder();
                    Gson gson = gsonBuilder.create();
                    String rduser = gson.toJson(all_rd);
                    out.println(rduser);
                    response.setStatus(200);
                }
            } catch (SQLException ex) {
                Logger.getLogger(ReturnDocUserForMSG.class.getName()).log(Level.SEVERE, null, ex);
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ReturnDocUserForMSG.class.getName()).log(Level.SEVERE, null, ex);
            }

        }
        response.setStatus(200);
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
        processRequest(request, response);
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
