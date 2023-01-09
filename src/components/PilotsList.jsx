import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/joy/Typography";

// To ensure things like 1.005 round correctly, use Number.EPSILON
// (difference between 1 and the smallest floating point number greater than 1)
function round(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function PilotsList(props) {
  return (
    <>
      <Typography fontSize="xl" fontWeight="lg" align="center" margin="1em">
        Pilots who violated the NDZ perimeter for the past 10 minutes
      </Typography>
      {props.pilotsNotReady || props.pilots.length == 0 ? (
        <h2>No Pilots in NDZ info yet...</h2>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Last Name and First Name </StyledTableCell>
                <StyledTableCell align="left">Email address</StyledTableCell>
                <StyledTableCell align="left">Phone number</StyledTableCell>
                <StyledTableCell align="left">Closest distance / meters</StyledTableCell>
                <StyledTableCell align="left">Last seen / minutes ago</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.pilots.map((pilot) => (
                <StyledTableRow key={pilot.pilotId}>
                  <StyledTableCell component="th" scope="row">
                    {pilot.lastName} {pilot.firstName}
                  </StyledTableCell>
                  <StyledTableCell align="left">{pilot.email}</StyledTableCell>
                  <StyledTableCell align="left">{pilot.phoneNumber}</StyledTableCell>
                  <StyledTableCell align="left">{round(pilot.closestDistance)}</StyledTableCell>
                  <StyledTableCell align="left">{Math.round(pilot.lastSeenMinAgo)}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default PilotsList;
