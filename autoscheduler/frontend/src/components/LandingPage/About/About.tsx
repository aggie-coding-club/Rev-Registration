import * as React from 'react';
import {
  Link, Dialog, Typography, DialogContent, DialogTitle,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

import * as about from './About.css';
import { Contributor } from './Contributors';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


const contributors: Contributor[] = [
  new Contributor({name: "Gannon", githubLink: "https://github.com/gannonprudhomme", linkedInLink: "linkhere", position: "Co-Manager"}),
  new Contributor({name: "Ryan", githubLink: "...", linkedInLink: null, position: "..."}),
]

const pastContributors: Contributor[] = [

]


const About: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (): void => {
    setOpen(true);
  };
  const handleClose = (): void => {
    setOpen(false);
  };

  const WhiteTextTypography = withStyles({
    root: {
      color: '#FFFFFF',
    },
  })(Typography);

  return (
    <div className={about.container}>
      <Link
        component="button"
        variant="body2"
        onClick={handleClickOpen}
      >
                About Rev Registration
      </Link>
      <Dialog
        onClose={handleClose}
        open={open}
      >
        <DialogTitle disableTypography className={about.title}>
          <WhiteTextTypography variant="h6">About</WhiteTextTypography>
          <IconButton onClick={handleClose}>
            <CloseIcon style={{ color: 'white' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <b>About</b>
            <p>
                Rev Registration is an open-source
              {' '}
              <a href="https://aggiecodingclub.com/">Aggie Coding Club</a>
              {' '}
project led by Gannon Prudhomme and Ryan Conn.
            </p>
            <p>
                You can find all our code on <a href="https://github.com/aggie-coding-club">Github</a>.
            </p>
          </Typography>
          <Typography gutterBottom>
            <b>Contributors</b>
            {contributors.map((item) => {
              console.log(item.name);
                return(
                  <div>
                    <Grid container spacing={3}>
                      <Grid item xs={3}>
                        <Paper className={about.paper}>{item.name}</Paper>
                      </Grid>
                      <Grid item xs={3}>
                        <Paper className={about.paper}>{item.position}</Paper>
                      </Grid>
                      <Grid item xs={3}>
                        <Paper className={about.paper}>
                          <a href={item.linkedInLink}>LinkedIn</a>
                        </Paper>
                      </Grid>
                      <Grid item xs={3}>
                        <Paper className={about.paper}>
                          <a href={item.githubLink}>GitHub</a>
                        </Paper>
                      </Grid>
                    </Grid>
                  </div>
                )
              })}
          </Typography>
          <Typography gutterBottom>
            <b>Previous Contributors</b>
          </Typography>
          <Typography gutterBottom>
            <b>License</b>
            <p>
              If you have any questions or suggestions, shoot us an email at
              {' '}
              <a href="mailto:revregistration@gmail.com">revregistration@gmail.com</a>
.
            </p>
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default About;
