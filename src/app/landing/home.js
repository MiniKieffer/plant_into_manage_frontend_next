"use client";
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { supabase } from '@/lib/supabaseClient';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert } from '@mui/material';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Home() {

    const [loading, setLoading] = useState(false);
    const [plants, setPlants] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [plantDeleteAlert, setPlantDeleteAlert] = useState(false);
    const [plantId, setPlantId] = useState(null);

    const [description, setDescription] = useState('');
    const [plantClass, setPlantClass] = useState('');
    const [genus, setGenus] = useState('');
    const [plantOrder, setPlantOrder] = useState('');
    const [plantFamily, setPlantFamily] = useState('');
    const [phylum, setPhylum] = useState('');
    const [kingdom, setKingdom] = useState('');

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const router = useRouter();



    const fetchPlants = async () => {
      const res = await fetch("https://cwomjbboqlvrqqdkzxfx.supabase.co/functions/v1/plants", {
        method: "GET",
        headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3b21qYmJvcWx2cnFxZGt6eGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDI1OTgsImV4cCI6MjA2MjA3ODU5OH0.CLpkN0nkY2bRZqphhLrgPggTdwwQv2t6h0AImiUP14A" },
      });
      const data = await res.json();
      if(!plants || plants?.length !== 0) {setPlants(data.data);}
      else { return;}
    };

    const updatePlants = async (id) => {
      try { 
        const res = await fetch("https://cwomjbboqlvrqqdkzxfx.supabase.co/functions/v1/plants", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3b21qYmJvcWx2cnFxZGt6eGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDI1OTgsImV4cCI6MjA2MjA3ODU5OH0.CLpkN0nkY2bRZqphhLrgPggTdwwQv2t6h0AImiUP14A", 
        },
        body: JSON.stringify({
          id: id, // the row id to update
          updates: {
            plant_description: description,
            plant_class: plantClass,
            plant_genus: genus,
            plant_order: plantOrder,
            plant_family: plantFamily,
            plant_phylum: phylum,
            plant_kingdom: kingdom
          },
        }),
      });
      if (res.ok) {
        handleClose();
        fetchPlants();
      } else {
        alert("Error");
      }
    } catch (error) {
      console.log(error);
    }
    }

    useEffect(() => {
      fetchPlants();
  },[]);

    useEffect(() => {
      const checkSession = async () => {
        const { data, error } = await supabase.auth.getUser();
  
        if (error || !data?.user) {
          router.push('/');
        } else {
          setLoading(false);
        }
      };
      checkSession();
    }, [router]);

    const handleListItemClick = ( event, index ) => {
      setSelectedIndex(index);
    };

    const deletePlant = async () => {
      try {
        const res = await fetch("https://cwomjbboqlvrqqdkzxfx.supabase.co/functions/v1/plants", {
          method: "DELETE",
          headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3b21qYmJvcWx2cnFxZGt6eGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDI1OTgsImV4cCI6MjA2MjA3ODU5OH0.CLpkN0nkY2bRZqphhLrgPggTdwwQv2t6h0AImiUP14A" },
          body: JSON.stringify({
            id: plantId,
          }),
        });
        if (res.ok) {
          fetchPlants();
        } else {
          alert("Error");
        }
      } catch (error) {
        console.log(error);
      }
  };

    return (
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <Box
               component="form"
               onSubmit={(e) => {
                e.preventDefault();
                updatePlants(plantId);
              }}
               noValidate
               sx={{
                 display: 'flex',
                 flexDirection: 'column',
                 gap: 2,
               }}
            >
            <FormControl>
              <FormLabel htmlFor="description">Description</FormLabel>
              <TextField
                multiline
                rows={4}
                id="description"
                type="description"
                name="description"
                placeholder="This is plant..."
                autoComplete="description"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="plantClass">Class</FormLabel>
              <TextField
                id="plantClass"
                type="plantClass"
                name="plantClass"
                placeholder="z_type"
                autoComplete="plantClass"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={plantClass}
                onChange={(e) => setPlantClass(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="genus">Genus</FormLabel>
              <TextField
                id="genus"
                type="genus"
                name="genus"
                placeholder="genus"
                autoComplete="genus"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={genus}
                onChange={(e) => setGenus(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="plantOrder">Order</FormLabel>
              <TextField
                id="plantOrder"
                type="plantOrder"
                name="plantOrder"
                placeholder="plantOrder"
                autoComplete="plantOrder"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={plantOrder}
                onChange={(e) => setPlantOrder(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="plantFamily">Family</FormLabel>
              <TextField
                id="plantFamily"
                type="plantFamily"
                name="plantFamily"
                placeholder="plantFamily"
                autoComplete="plantFamily"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={plantFamily}
                onChange={(e) => setPlantFamily(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="phylum">Phylum</FormLabel>
              <TextField
                id="phylum"
                type="phylum"
                name="phylum"
                placeholder="phylum"
                autoComplete="phylum"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={phylum}
                onChange={(e) => setPhylum(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="kingdom">Kingdom</FormLabel>
              <TextField
                id="kingdom"
                type="kingdom"
                name="kingdom"
                placeholder="kingdom"
                autoComplete="kingdom"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={kingdom}
                onChange={(e) => setKingdom(e.target.value)}
              />
            </FormControl>
            <Stack spacing={2} direction="row" style={{marginBottom:'5px'}}>
              <Button
                type="submit"
                variant="contained"
              >
                Replace
              </Button>
              <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            </Stack>
            </Box>
          </Box>
        </Modal>
        {plantDeleteAlert && (
          <Alert
            severity="danger"
            onClose={() => setPlantDeleteAlert(false)} 
            style={{backgroundColor:'lightcoral'}}
            action={
              <>
                  <Button color="inherit" size="small" onClick={() => {setPlantDeleteAlert(false); deletePlant();}}>
                    OK
                  </Button>
                  <Button color="inherit" size="small" onClick={() => setPlantDeleteAlert(false)}>
                    CLOSE
                  </Button>
              </>
            }
          >
           Do really want to delete this Ad?
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Grid container spacing={2} columns={12}>
                <Box
                  component="form"
                  noValidate
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: 2,
                  }}
                >
                  {plants?.map((plant, index) => (
                        <div  key = {plant.id}>
                            <Accordion key = {plant.id} style={{marginTop:'10px', marginBottom:'10px'}} expanded={selectedIndex === index} onChange={() => setSelectedIndex(index)}>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls= {`panel1-content${index}`}
                                id={`panel${index}-header`}
                                onClick={(event) => {handleListItemClick(event, index); }}
                                style={{ color: 'black', marginBottom: '2px' }}
                              >
                                
                                <Typography component="span">{plant.plant_name}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                              <Stack spacing={2} direction="row" style={{marginBottom:'5px'}}>
                                <Button variant="outlined" onClick={() => {handleOpen(); 
                                                                          setPlantId(plant.id);
                                                                          setDescription(plant.plant_description);
                                                                          setPlantClass(plant.plant_class);
                                                                          setGenus(plant.plant_genus);
                                                                          setPlantOrder(plant.plant_order);
                                                                          setPlantFamily(plant.plant_family);
                                                                          setPhylum(plant.plant_phylum);
                                                                          setKingdom(plant.plant_kingdom);
                                }}>
                                  <CreateIcon />
                                </Button>
                                <Button variant="outlined" onClick={() => {setPlantDeleteAlert(true); setPlantId(plant.id);}}><DeleteIcon /></Button>
                                </Stack>
                              <Grid container spacing={2} columns={12}>
                              <Grid size={{ xs: 3, md: 3 }}>
                                <img src={plant.photo_url} alt="Plant" style={{ maxWidth: '100%', height: 'auto' }} />
                              </Grid>
                              <Grid size={{ xs: 7, md: 7 }}>
                                 Description:{"\n"}
                                {plant.plant_description}
                              </Grid>
                              <Grid size={{ xs: 2, md: 2 }}>
                                <Box>
                                Class:{"\n"}
                                {plant.plant_class}
                                </Box>
                                <Box>
                                Genus:{"\n"}
                                {plant.plant_genus}
                                </Box>
                                <Box>
                                Order:{"\n"}
                                {plant.plant_order}
                                </Box>
                                <Box>
                                Family:{"\n"}
                                {plant.plant_family}
                                </Box>
                                <Box>
                                Phylum:{"\n"}
                                {plant.plant_phylum}
                                </Box>
                                <Box>
                                Kingdom:{"\n"}
                                {plant.plant_kingdom}
                                </Box>
                              </Grid>
                              </Grid>
                              <Box>
                                <a href={plant.wiki_url} target="_blank" rel="noopener noreferrer" style={{color:'darkblue'}}>
                                    Learn more on Wikipedia
                                </a>
                              </Box>
                              </AccordionDetails>
                            </Accordion>
                            <Divider />
                        </div>
                    ))}
                </Box>
            </Grid>
          
        </Box>
      </Container>
    );
}