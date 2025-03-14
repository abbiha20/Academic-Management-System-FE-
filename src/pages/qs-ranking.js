import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
  TablePagination,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

import "./Profile.css";



const QSRanking = () => {
  const [rankings, setRankings] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchDataFromExcel = async () => {
      try {
        const response = await fetch("/QSWorldUniversityRankings2025.xlsx");
        const blob = await response.blob();
        const data = await blob.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData.splice(0, 3);
        console.log(jsonData);
        const parsedRankings = jsonData.map((row) => ({
          rank: row["2025 QS World University Rankings"],
          name: row["__EMPTY_2"],
          country: row["__EMPTY_3"],
          score: row["__EMPTY_27"],
          region: row["__EMPTY_4"],
        }));

        setRankings(parsedRankings);
      } catch (error) {
        console.error("Error reading Excel file:", error);
      }
    };

    fetchDataFromExcel();
  }, []);

  const filteredRankings = rankings.filter(
    (uni) =>
      (region === "All" || (uni.country && uni.region.includes(region))) &&
      (uni.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container className="container">
      <Header />
      <SideBar
        items={[
          { name: "Dashboard", link: "/" },
          { name: "Students", link: "/students" },
          { name: "Departments & Degrees", link: "/departments" },
          { name: "QS Rankings", link: "/qs-ranking" },
        ]}
      />
      <div className="dashboard" width="100%">
        <Typography variant="h4" align="center" >
          QS World University Rankings
        </Typography>

        <TextField
          label="Search University"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        >
          <MenuItem value="All">All Regions</MenuItem>
          <MenuItem value="Asia">Asia</MenuItem>
          <MenuItem value="Europe">Europe</MenuItem>
          <MenuItem value="Americas">Americas</MenuItem>
        </Select>

        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>University Name</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRankings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((uni, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{uni.rank}</TableCell>
                    <TableCell>{uni.name}</TableCell>
                    <TableCell>{uni.country}</TableCell>
                    <TableCell>{uni.score}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRankings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      <Typography variant="h5" align="center" gutterBottom>
        Ranking Trends
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredRankings.slice(0, 10)}>
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#1976d2" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default QSRanking;