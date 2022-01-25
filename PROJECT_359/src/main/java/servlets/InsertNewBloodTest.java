/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import database.tables.EditBloodTestTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.BloodTest;

/**
 *
 * @author kosta
 */
public class InsertNewBloodTest extends HttpServlet {

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
            out.println("<title>Servlet InsertNewBloodTest</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet InsertNewBloodTest at " + request.getContextPath() + "</h1>");
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
        String amka = request.getParameter("amka");
        String test_date = request.getParameter("test_date");
        String medical_center = request.getParameter("medical_center");

        double blood_sugar = (Double.parseDouble(request.getParameter("blood_sugar")));
        double cholesterol = (Double.parseDouble(request.getParameter("cholesterol")));
        double iron = (Double.parseDouble(request.getParameter("iron")));
        double vitamin_d3 = (Double.parseDouble(request.getParameter("vitamin_d3")));
        double vitamin_b12 = (Double.parseDouble(request.getParameter("vitamin_b12")));


        BloodTest bt = new BloodTest();
        bt.setAmka(amka);
        bt.setTest_date(test_date);
        bt.setMedical_center(medical_center);
        bt.setBlood_sugar(blood_sugar);
        bt.setBlood_sugar_level();
        bt.setCholesterol(cholesterol);
        bt.setCholesterol_level();
        bt.setIron(iron);
        bt.setIron_level();
        bt.setVitamin_d3(vitamin_d3);
        bt.setVitamin_d3_level();
        bt.setVitamin_b12(vitamin_b12);
        bt.setVitamin_b12_level();
        EditBloodTestTable NewBloodTest = new EditBloodTestTable();

        try (PrintWriter out = response.getWriter()) {
            NewBloodTest.createNewBloodTest(bt);
            response.setStatus(200);

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(InsertNewBloodTest.class.getName()).log(Level.SEVERE, null, ex);
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
