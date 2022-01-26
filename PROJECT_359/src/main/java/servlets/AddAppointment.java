/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import database.tables.EditRandevouzTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Randevouz;

/**
 *
 * @author kosta
 */
public class AddAppointment extends HttpServlet {

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
            out.println("<title>Servlet AddAppointment</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet AddAppointment at " + request.getContextPath() + "</h1>");
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
        String dateCalendar = request.getParameter("date");
        String hour = request.getParameter("hour");
        String minutes = request.getParameter("minutes");
        String date = dateCalendar + " " + hour + ":" + minutes + ":00";

        int docID = (Integer.parseInt(request.getParameter("doctor_id")));
        int price = (Integer.parseInt(request.getParameter("price")));
        String status = request.getParameter("status");
        String CurrentTime = request.getParameter("CurrentTime");

        Randevouz rand = new Randevouz();
        rand.setDate_time(date);
        rand.setDoctor_id(docID);
        rand.setDoctor_info("null");
        rand.setPrice(price);
        rand.setStatus(status);
        rand.setUser_id(0);
        rand.setUser_info("null");
        EditRandevouzTable RandTable = new EditRandevouzTable();
        try (PrintWriter out = response.getWriter()) {
            if (date.compareTo(CurrentTime) <= 0) {
                response.setStatus(403);
            } else {
                RandTable.createNewRandevouz(rand);
                response.setStatus(200);
            }


        } catch (ClassNotFoundException ex) {
            Logger.getLogger(AddAppointment.class.getName()).log(Level.SEVERE, null, ex);
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
