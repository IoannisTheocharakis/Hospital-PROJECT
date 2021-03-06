/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import database.tables.EditTreatmentTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Treatment;

/**
 *
 * @author kosta
 */
public class CreateNewTreatment extends HttpServlet {

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
            out.println("<title>Servlet CreateNewTreatment</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet CreateNewTreatment at " + request.getContextPath() + "</h1>");
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
        int docID = (Integer.parseInt(request.getParameter("doctor_id")));
        int userID = (Integer.parseInt(request.getParameter("user_id")));

        String startdate = request.getParameter("startdate");
        String lastdate = request.getParameter("lastdate");
        String treatmentText = request.getParameter("treatmentText");

        Treatment tr = new Treatment();

        tr.setDoctor_id(docID);
        tr.setUser_id(userID);
        tr.setStart_date(startdate);
        tr.setEnd_date(lastdate);
        tr.setTreatment_text(treatmentText);
        tr.setBloodtest_id(userID);

        System.out.println("SAAAAAAAAAAAAAAAAAA");
        EditTreatmentTable RandTable = new EditTreatmentTable();
        try (PrintWriter out = response.getWriter()) {
            RandTable.createNewTreatment(tr);
            response.setStatus(200);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(CreateNewTreatment.class.getName()).log(Level.SEVERE, null, ex);
        }

//        System.out.println(docID + "" + userID);
        response.setStatus(200);
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
