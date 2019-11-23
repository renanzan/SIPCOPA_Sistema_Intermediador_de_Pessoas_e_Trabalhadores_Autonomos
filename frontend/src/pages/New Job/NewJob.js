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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
    const [custos, setCustos] = React.useState(0);
    const [receber, setReceber] = React.useState(0);

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
            <DialogTitle id="form-dialog-title">Calculadora de Valor</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Não sabe quanto cobrar pelo seu serviço?<br />Podemos te ajudar com isso!
              </DialogContentText>
              <div>
                  { job ? <PricesTable job={job} /> : 'Nenhum serviço selecionado.' }
              </div>

              <TextField
                margin="dense"
                id="custos"
                label="Soma dos custos com o trabalho em reais"
                type="number"
                helperText="Funcionário, impostos, etc."
                inputProps={{ min: "0", max: "10", step: "1" }}
                style={{ marginTop:'20px' }}
                fullWidth
                onChange={e => {
                  setCustos(e.target.value)
                }}
              />
              <TextField
                margin="dense"
                id="receber"
                label="Quanto você pretende receber por trabalho em reais"
                type="number"
                inputProps={{ min: "0", max: "10", step: "1" }}
                style={{ marginTop:'20px' }}
                fullWidth
                onChange={e => {
                  setReceber(e.target.value)
                }}
              />
              <div>
                Sugestão de preço R$ 
                { Number.parseFloat(custos) + Number.parseFloat(receber) } (
                { Math.ceil((Number.parseFloat(custos) + Number.parseFloat(receber)) / 2) } bitpoints)
              </div>
              
              <div>
                O valor resultante está abaixo do menor valor cobrado nas mesmas situações, este valor provavelmente é atrativo para o mercado.
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button><Button onClick={handleClose} color="primary">
                Subscribe
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
}

const PricesTable = ({ job }) => {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const useStyles = makeStyles({
    root: {
      width: '100%',
      overflowX: 'auto',
    },
    table: {
      minWidth: 650,
    },
  });
  
  function createData(avaliacao, ocorrencia, _min, _max, _medParcial, _med) {
    const min = (_min !== -1) ? _min : 'NaN';
    const max = (_max !== -1) ? _max : 'NaN';
    const medParcial = (_medParcial !== -1) ? _medParcial : 'NaN';
    const med = (_med !== -1) ? _med : 'NaN';

    return { avaliacao, ocorrencia, min, max, medParcial, med };
  }

  const classes = useStyles();

    React.useEffect(() => {
        (async () => {
            setLoading(true);

            await api.post('/job/suggest_price', {
                job
            }).then(response => {
              if(response.data) {
                const { data } = response;

                const tempRows = [];

                for(var index = 0; index < 5; index++) {
                  tempRows.push(
                    createData(
                      data.price_by_rate.rate_range[index],
                      data.price_by_rate.occurrences[index],
                      data.price_by_rate.smaller_price[index],
                      data.price_by_rate.biggest_price[index],
                      data.price_by_rate.partial_average[index],
                      data.price_by_rate.average[index]
                    )
                  );
                }

                setRows(tempRows);
              }
            });
            
            setLoading(false);
        })();
    }, [job]);
  
  return(
    <div>
       {
         loading ?
          'Loading...' :
        <div>
          <div style={{ marginBottom:'20px'}}>Serviço selecionado: <b>{job}</b></div>

          <Paper className={classes.root}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Avaliação</TableCell>
                <TableCell align="right">Ocorrencia</TableCell>
                <TableCell align="right">Mínimo&nbsp;(bp)</TableCell>
                <TableCell align="right">Máximo&nbsp;(bp)</TableCell>
                <TableCell align="right">Média P.&nbsp;(bp)</TableCell>
                <TableCell align="right">Média&nbsp;(bp)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row" align="center">{row.avaliacao}</TableCell>
                  <TableCell align="center">{row.ocorrencia}</TableCell>
                  <TableCell align="center">{row.min}</TableCell>
                  <TableCell align="center">{row.max}</TableCell>
                  <TableCell align="center">{row.medParcial}</TableCell>
                  <TableCell align="center">{row.med}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </Paper>
        </div>
       }
    </div>
  );
}