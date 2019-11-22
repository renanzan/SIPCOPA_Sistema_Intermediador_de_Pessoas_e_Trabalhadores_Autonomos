import React from 'react';

import api from '../../services/api';

import { withStyles, makeStyles } from '@material-ui/core/styles';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function NewJob({ history }) {
    const [job, setJob] = React.useState();
    const [description, setDescription] = React.useState();
    const [price, setPrice] = React.useState();

    const handleAddWork = () => {
        api.post('/job/new', {
            job,
            description,
            price
        }, {
            headers: {
                authentication: localStorage.getItem('@sipcopa/token')
            }
        }).then(() => {
            history.push('/my_account');
        });
    }

    return(
        <div className="main-container" style={{ paddingBottom:120, justifyContent:'center', alignItems:'center'}}>
            <div className="card" style={{ padding:50, minWidth: '25%' }}>
                <label className="card-title">Adicionar Trabalho</label>
                <InputTipo job={job} setJob={setJob} />
                <InputDescription description={description} setDescription={setDescription} />
                <InputValue price={price} setPrice={setPrice} />

                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
                    <DialogCalculator job={job} />
                    <ConfirmButton handleAddWork={handleAddWork} />
                    <CancelButton handleAddWork={handleAddWork} />
                </div>
            </div>
        </div>
    );
}

const InputTipo = ({ job, setJob }) => {
    const inputLabel = React.useRef(null);

    const [jobOptions, setJobOptions] = React.useState();

    React.useEffect(() => {
        (async () => {
            const allJobOptions = await api.get('get_job_option');

            if(allJobOptions) {
                setJobOptions(allJobOptions.data);
            }
        })();
    }, []);

    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);
    
    return(
        <FormControl variant="outlined" style={{ marginTop:50 }}>
            <InputLabel ref={inputLabel} id="job-label">Trabalho</InputLabel>
            <Select
                labelId="job-label"
                id="select-job"
                value={job}
                onChange={e => { setJob(e.target.value); }}
                labelWidth={labelWidth}
                style={{ width:'100%', minWidth: 300 }}>
                    
                {
                    jobOptions ?
                        jobOptions.map((element, index) => {
                            return(
                                <MenuItem key={index} value={element}>{element}</MenuItem>
                            );
                        })
                    : null
                }

            </Select>
        </FormControl>
    );
}

const InputDescription = ({ description, setDescription }) => {
    const useStyles = makeStyles(theme => ({
        textField: {
          width: '100%',
          minWidth: 300,
          marginTop: '20px'
        }
      }));

    const classes = useStyles();

    return(
        <TextField
                id="outlined-basic"
                className={classes.textField}
                label="Descrição"
                multiline
                value={description}
                onChange={e => { setDescription(e.target.value); }}
                rows="3"
                rowsMax="5"
                margin="normal"
                variant="outlined" />
    );
}

const InputValue = ({ price, setPrice }) => {
    const useStyles = makeStyles(theme => ({
        textField: {
          width: '100%',
          minWidth: 300,
          marginTop: '20px'
        }
      }));

    const classes = useStyles();

    return(
        <TextField
            id="outlined-number"
            label="Valor em pontos"
            type="number"
            value={price}
            onChange={e => { setPrice(e.target.value); }}
            className={classes.textField}
            InputLabelProps={{
                shrink: true,
            }}
            margin="normal"
            variant="outlined"
        />
    );
}

const CalculatorButton = ({ onClick }) => {
    const BootstrapButton = withStyles({
        root: {
          boxShadow: 'none',
          textTransform: 'none',
          fontSize: 12,
          fontWeight: 300,
          fontVariant: 'small-caps',
          padding: '6px 12px',
          lineHeight: 1.5,
          backgroundColor: 'transparent !important',
          color: 'black',
          width: '150px',
          fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1) !important',
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
            // backgroundColor: '#0062cc',
            // borderColor: '#005cbf',
          },
          '&:focus': {
            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
          },
        },
      })(Button);

    const useStyles = makeStyles(theme => ({
        button: {
          margin: theme.spacing(1),
        }
      }));

      const classes = useStyles();

      return (
          <div>
            <BootstrapButton variant="contained" color="primary" onClick={onClick} className={classes.margin}>Calculadora</BootstrapButton>
        </div>
      );
}

const ConfirmButton = ({ handleAddWork }) => {
    const BootstrapButton = withStyles({
        root: {
          boxShadow: 'none',
          textTransform: 'none',
          fontVariant: 'small-caps',
          fontWeight: '300',
          fontSize: 14,
          padding: '6px 12px',
          border: '1px solid',
          lineHeight: 1.5,
          backgroundColor: '#2AABCC',
          marginTop: '40px',
          width: '200px',
          fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
          '&:hover': {
            backgroundColor: '#4796AA !important',
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
            // backgroundColor: '#0062cc',
            // borderColor: '#005cbf',
          },
          '&:focus': {
            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
          },
        },
      })(Button);

    const useStyles = makeStyles(theme => ({
        button: {
          margin: theme.spacing(1),
        }
      }));

      const classes = useStyles();

      return (
          <div>
            <BootstrapButton variant="contained" color="primary" className={classes.margin} onClick={e => { handleAddWork(); }}>Adicionar</BootstrapButton>
        </div>
      );
}

const CancelButton = ({ handleAddWork }) => {
    const BootstrapButton = withStyles({
        root: {
          boxShadow: 'none',
          textTransform: 'none',
          fontVariant: 'small-caps',
          fontWeight: '300',
          marginTop: 5,
          fontSize: 14,
          padding: '6px 12px',
          lineHeight: 1.5,
          backgroundColor: 'transparent !important',
          color: 'red',
          width: '200px',
          fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1) !important',
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
            // backgroundColor: '#0062cc',
            // borderColor: '#005cbf',
          },
          '&:focus': {
            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
          },
        },
      })(Button);

    const useStyles = makeStyles(theme => ({
        button: {
          margin: theme.spacing(1),
        }
      }));

      const classes = useStyles();

      return (
          <div>
            <BootstrapButton variant="contained" color="primary" className={classes.margin} onClick={e => { handleAddWork(); }}>Cancelar</BootstrapButton>
        </div>
      );
}

const DialogCalculator = ({ job }) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const teste = await api.post('/job/suggest_price', {
                job
            });
    
            if(teste)
                console.log(teste.data);
        })();
    }, [job]);

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      return (
        <div>
          <CalculatorButton onClick={handleClickOpen} />
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Calculadora</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Não sabe quanto cobrar pelo seu serviço?<br />Podemos te ajudar nisso!
              </DialogContentText>
              <div>
                  { job ? <div>Serviço selecionado: {job}</div> : 'Nenhum serviço selecionado.' }
              </div>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleClose} color="primary">
                Subscribe
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
}