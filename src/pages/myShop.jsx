import GlobalNavBar from "../components/GlobalNavBar"
import React from "react"
import ProductViewContainer from "../components/ProductViewContainer"
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function MyShop() {
    return <React.Fragment>
        <header>
            <GlobalNavBar />

        </header>
        <div >
            <ProductViewContainer userID={selfUserID}>

            </ProductViewContainer>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <Fab color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
            </Box>
        </div>
    </React.Fragment>
}