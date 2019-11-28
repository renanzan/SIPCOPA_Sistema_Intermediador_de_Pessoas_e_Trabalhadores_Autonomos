import React from 'react';

import api from '../../services/api';

import animationData from '../../assets/animations/lottie.json/calculating.json';
import LottieControl from '../../assets/animations/LottieControl';

import { withStyles, makeStyles } from '@material-ui/core/styles';
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

function createData(avaliacao, ocorrencia, _min, _max, _medParcial, _med) {
    const min = (_min !== -1) ? _min : 'NaN';
    const max = (_max !== -1) ? _max : 'NaN';
    const medParcial = (_medParcial !== -1) ? _medParcial : 'NaN';
    const med = (_med !== -1) ? _med : 'NaN';

    return { avaliacao, ocorrencia, min, max, medParcial, med };
}

export default function CalculatorDialog({ job, setPrice }) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [bitpoints, setBitpoints] = React.useState(0);
    const [custos, setCustos] = React.useState(0);
    const [receber, setReceber] = React.useState(0);

    React.useEffect(() => {
        if(job)
            (async () => {
                setLoading(true);

                console.log('TESTE');

                await api.post('/job/suggest_price', { job }).then(response => {
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

                        console.log(response.data);

                        setRows(tempRows);
                        setLoading(false);
                    }
                });
            })();
    }, [job]);

    return (
        <div>
            <CalculatorButton onClick={() => { setOpen(true); }} />
            
            <Dialog open={open} onClose={() => { setOpen(false); }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Calculadora de Valor</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Não sabe quanto cobrar pelo seu serviço?<br />
                        Podemos te ajudar com isso!
                    </DialogContentText>
                    {
                        loading ?
                            <div style={{ display:'flex', flexDirection:'column', alignItems:'center'}}>
                                <LottieControl animationData={animationData} height="100" width="100" style={{ marginTop:'30px', marginBottom:'30px' }} />
                                <label>Coletando informações...</label>
                                <label style={{ marginBottom:'10px' }}>Isso pode levar alguns instantes.</label>
                            </div> :
                        
                            <div>
                                { !job ? 
                                    <div>
                                        <b>Nenhum serviço selecionado</b><br />
                                        Experimente selecionar um serviço antes de abrir a calculadora.
                                    </div>
                                    :
                                <div>
                                    <PricesTable job={job} rows={rows} />

                                    <div style={{ backgroundColor:'#FBFBFD', marginTop:'10px', padding:'0 20px 20px 20px' }}>
                                        <TextField
                                            margin="dense"
                                            id="custos"
                                            label="Soma dos custos com o trabalho em reais"
                                            type="number"
                                            helperText="Funcionário, impostos, terceiros, etc."
                                            inputProps={{ min: "0", step: "1" }}
                                            fullWidth
                                            onChange={e => { setCustos(e.target.value); setBitpoints(Math.ceil((Number.parseFloat(e.target.value) + Number.parseFloat(receber)) / 1.35)); }} />
                                        <TextField
                                            margin="dense"
                                            id="receber"
                                            label="Quanto você pretende receber por trabalho em reais"
                                            type="number"
                                            inputProps={{ min: "0", step: "1" }}
                                            style={{ marginTop:'20px' }}
                                            fullWidth
                                            onChange={e => { setReceber(e.target.value); setBitpoints(Math.ceil((Number.parseFloat(custos) + Number.parseFloat(e.target.value)) / 1.35)); }} />

                                        {
                                            !(custos && receber) ? null :
                                            <div>
                                                <div style={{ marginTop:'30px', fontWeight:600 }}>
                                                    Sugestão de preço R$ 
                                                    { Math.ceil(Number.parseFloat(custos) + Number.parseFloat(receber)) } (
                                                    { bitpoints } bitpoints)
                                                </div>

                                                <div style={{ marginTop:'5px' }}>
                                                    { (rows[0].ocorrencia === 0) ?
                                                        'Não há registros de trabalhadores novos neste serviço, você será o primeiro, faça seu preço.'
                                                    : (rows[0].min > bitpoints) ?
                                                        `O valor resultante está ${Math.ceil(100 - ((bitpoints * 100) / rows[0].max))}% abaixo do menor valor cobrado nas mesmas condições, este valor provavelmente é atrativo para o mercado.`
                                                    : (rows[0].max < bitpoints) ?
                                                        `O valor resultante está ${Math.ceil(((bitpoints * 100) / rows[0].max) - 100)}% acima do maior valor cobrado nas mesmas condições, este valor pode não ser muito atrativo para o mercado.`
                                                    : (rows[0].min === bitpoints) ?
                                                        'O valor resultante é exatamente igual ao menor valor cobrado nas mesmas condições, este valor provavelmente é atrativo para o mercado.'
                                                    : 'Nada a acrescentar.'}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div> }

                        </div>
                    }
                </DialogContent>

                {
                    loading ? null :
                    <DialogActions>
                        <Button onClick={() => { setOpen(false); setCustos(0); setReceber(0); }} color="primary">Cancelar</Button>
                        {
                            !job ? null :
                                <Button onClick={() => { setOpen(false); setCustos(0); setReceber(0); setPrice(bitpoints); }} color="primary">Prosseguir</Button>
                        }
                    </DialogActions>
                }
            </Dialog>
        </div>
    );
}

const PricesTable = ({ job, rows }) => {

    const useStyles = makeStyles({
      root: {
        width: '100%',
        overflowX: 'auto',
      },
      table: {
        minWidth: 650,
      },
    });
  
    const classes = useStyles();
    
    return(
        <div>
            <div style={{ marginBottom:'20px'}}>Serviço selecionado: <b>{job}</b></div>

            <Paper className={classes.root}>
            <Table className={classes.table} aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell>Avaliação</TableCell>
                <TableCell align="right">Ocorrencia</TableCell>
                <TableCell align="right">Menor&nbsp;(bp)</TableCell>
                <TableCell align="right">Maior&nbsp;(bp)</TableCell>
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