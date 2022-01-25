/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package database.tables;

import com.google.gson.Gson;
import mainClasses.Randevouz;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.SimpleUser;

/**
 *
 * @author Mike
 */
public class EditRandevouzTable {

   
    public void addRandevouzFromJSON(String json) throws ClassNotFoundException{
         Randevouz r=jsonToRandevouz(json);
         createNewRandevouz(r);
    }
    
    
     public Randevouz databaseToRandevouz(int id) throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM randevouz WHERE randevouz_id= '" + id + "'");
            rs.next();
            String json=DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Randevouz bt = gson.fromJson(json, Randevouz.class);
            return bt;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    /*new*/
    public ArrayList<SimpleUser> GetUserFromID(int id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        ArrayList<SimpleUser> UserArray = new ArrayList<SimpleUser>();

        try {
            rs = stmt.executeQuery("SELECT u.*, r.date_time FROM users AS u JOIN randevouz AS r ON u.user_id = r.user_id WHERE r.doctor_id= '" + id + "' ORDER BY r.date_time DESC");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                System.out.println(json);
                SimpleUser User = gson.fromJson(json, SimpleUser.class);
                UserArray.add(User);
            }
            return UserArray;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }
    /*also new*/
    public ArrayList<Randevouz> GetRandevouzFromID(int id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        ArrayList<Randevouz> UserArray = new ArrayList<Randevouz>();

        try {
            rs = stmt.executeQuery("SELECT r.* FROM randevouz AS r JOIN users AS u ON r.user_id = u.user_id WHERE r.doctor_id= '" + id + "' ORDER BY r.date_time DESC");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                System.out.println(json);
                Randevouz User = gson.fromJson(json, Randevouz.class);
                UserArray.add(User);
            }
            return UserArray;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }
  
    public Randevouz jsonToRandevouz(String json) {
        Gson gson = new Gson();
        Randevouz r = gson.fromJson(json, Randevouz.class);
        return r;
    }
     
         
      public String randevouzToJSON(Randevouz r) {
        Gson gson = new Gson();

        String json = gson.toJson(r, Randevouz.class);
        return json;
    }


    public void updateRandevouz(int randevouzID, int userID, String info, String status) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String updateQuery = "UPDATE randevouz SET user_id='" + userID + "',status='" + status +"',user_info='" + info + "' WHERE randevouz_id = '" + randevouzID + "'";
        stmt.executeUpdate(updateQuery);
        stmt.close();
        con.close();
    }

    public void deleteRandevouz(int randevouzID) throws SQLException, ClassNotFoundException{
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String deleteQuery = "DELETE FROM randevouz WHERE randevouz_id='" + randevouzID + "'";
        stmt.executeUpdate(deleteQuery);
        stmt.close();
        con.close();
    }



    public void createRandevouzTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String sql = "CREATE TABLE randevouz "
                + "(randevouz_id INTEGER not NULL AUTO_INCREMENT, "
                + " doctor_id INTEGER not NULL, "
                + " user_id INTEGER not NULL, "
                + " date_time TIMESTAMP not NULL, "
                + " price INTEGER  not NULL, "
                + " doctor_info VARCHAR(500),"
                + " user_info VARCHAR(500),"
                + " status VARCHAR(15) not null,"
                + "FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id), "
                + " PRIMARY KEY ( randevouz_id  ))";
        stmt.execute(sql);
        stmt.close();
        con.close();

    }

    /**
     * Establish a database connection and add in the database.
     *
     * @throws ClassNotFoundException
     */
    public void createNewRandevouz(Randevouz rand) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " randevouz (doctor_id,user_id,date_time,price,doctor_info,user_info,status)"
                    + " VALUES ("
                    + "'" + rand.getDoctor_id() + "',"
                    + "'" + rand.getUser_id() + "',"
                    + "'" + rand.getDate_time() + "',"
                    + "'" + rand.getPrice() + "',"
                    + "'" + rand.getDoctor_info() + "',"
                    + "'" + rand.getUser_info() + "',"
                    + "'" + rand.getStatus() + "'"
                    + ")";
            //stmt.execute(table);

            stmt.executeUpdate(insertQuery);
            System.out.println("# The randevouz was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditRandevouzTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
