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
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import "./Profile.css";
import { ApifyClient } from 'apify-client';


const QSRanking = () => {
  const [rankings, setRankings] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");

  

  useEffect(() => {
    const fetchRankings = async () => {
        try {
            const response = await axios.get("https://api.apify.com/v2/acts/vbartonicek~topuniversities-scraper/runs?token=apify_api_2nrq1eYDwkcAnofA3L93OQh9SJJnrO4Fn6Id", {
                headers: {
                    "Authorization": "apify_api_2nrq1eYDwkcAnofA3L93OQh9SJJnrO4Fn6Id" // Replace with your actual token
                }
            });
            setRankings(response.data); // Adjust based on API response format
        } catch (error) {
            console.error("Error fetching rankings from Apify:", error);
        }
    };

    fetchRankings();
}, []);

  const filteredRankings = rankings.filter((uni) =>
    (region === "All" || uni.region === region) &&
    uni.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="container">
      <Header />
      <SideBar
        items={[
          { name: 'Dashboard', link: '/' },
          { name: 'Students', link: '/students' },
          { name: 'Departments & Degrees', link: '/departments' },
          { name: 'QS Rankings', link: '/qs-rankings' }
        ]}
      />
      <div className="dashboard">
        <Typography variant="h4" align="center" gutterBottom>
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
          <MenuItem value="America">America</MenuItem>
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
              {filteredRankings.map((uni) => (
                <TableRow key={uni.rank}>
                  <TableCell>{uni.rank}</TableCell>
                  <TableCell>{uni.name}</TableCell>
                  <TableCell>{uni.country}</TableCell>
                  <TableCell>{uni.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
      </div>
    </Container>
  );
};

export default QSRanking;
