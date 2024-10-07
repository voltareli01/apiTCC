import * as db from '../repository/consultaRepository.js'
import jwt from 'jsonwebtoken';
import {Router} from "express";
const endpoints = Router();



endpoints.get ('/consultaFinalizar/:cpf', async (req, resp) => {
    let cpf = req.params.value


    try {
        
        let resposta = await db.consultaFinalizar(cpf)

        if (resposta == true) {
           
        } else if (resposta == false) {
            
        }

        resp.send(resposta)

    } catch (error) {
        resp.status(404).send({
            error: error
        })
    }
})

endpoints.post('/login', async (req, res) => {
    const info = req.body; 
    
    if (!info.email || !info.senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const usuario = await db.verificarLogin(info);

   
        
        if (!usuario) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        
        
        const token = jwt.sign({ id: usuario.id_login }, process.env.JWT_SECRET);
      
     
        return res.status(200).send({ token });
        
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Erro ao realizar o login:', error);
        return res.status(404).json({ message: 'Erro ao realizar o login.' });
    }
});






endpoints.get('/consultasPassadas', async (req,resp) => {
    
    
    try {
        
        let registros = await db.consultarConsultasPassadas();
        resp.send(registros)
        
    }
    catch (err) {
        
        resp.status(400).send({
            message:'erro ao consultar pacientes',
            erro: err.message
        })
        
    }
})

endpoints.get('/consultasFuturas', async (req,resp) => {
    
    
    try {
        
        let registros = await db.consultarConsultasFuturas();
        resp.send(registros)
        
    }
    catch (err) {
        console.log(err);
        resp.status(400).send({
            erro: err.message
        })
    }
})

endpoints.get('/consultasCpf/:cpf', async (req,resp) => {
    
    let cpf = req.params.cpf
    try {
        
            let registros = await db.consultarConsultasCpf(`${cpf}%`);
            resp.send(registros)
        
    }
    catch (err) {
        
        resp.status(400).send({
            erro: err.message
        })
    }
})


endpoints.post('/autocadastro', async (req,resp) => {
    
    let cadastro = req.body;
    
    try {
        
        let id = await db.inserirAutoCadastro(cadastro);
        
        resp.send({
            confirmação: "Consulta agendada!",
            pacienteId: id
        });
    } catch (err) {
        console.error('Erro ao cadastrar paciente:', err);
        resp.status(400).send({
            erro: err.message
        });
    }
});

endpoints.put('/consultas/:id', async (req,resp) => {
    
    
    try {
        
        let id = req.params.id;
        let consulta=req.body;
        
        let linhasAfetadas=await db.alterarCarros(id,consulta);
        if(linhasAfetadas==0){
            resp.status(404).send({erro:' nenhum registro encontrado'})
            
        }
        else(resp.send('Consulta concluida!'))
        
        
        
    }
    catch (err) {
        
        resp.status(400).send({
            erro: err.message
        })
    }
})


endpoints.post('/financeiro', async (req, resp) => {
    let financeiro = req.body; 
    
    try {
        
        let registros = await db.consultarfinanceiro(financeiro);
        
        resp.send(registros);
        
        
    } catch (err) {
        
        resp.status(400).send({
            erro: err.message
        });
    }
});

endpoints.post('/agenda', async (req,resp) => {
    
    
    try {
        
        let info = req.body;
        
        let id = await db.inserirAgenda(info);
        
        resp.send({
            agendaId: id
        })
        
        
    }
    catch (err) {
        
        resp.status(400).send({
            erro: err.message
        })
    }
})


endpoints.post('/consultas', async (req,resp) => {
    
    
    try {
        
        let info = req.body;
        
        let id = await db.criarConsultas(info);
        
        resp.send({
            consultaId: id
        })
        
        
    }
    catch (err) {
        
        resp.status(400).send({
            erro: err.message
        })
    }
})


endpoints.get('/agenda/consultas', (req, resp) => {
    try {
        let resposta = db.consultarConsultasCpf()
        
        resp.send(resposta)
    } catch (error) {
        
    }
})




endpoints.get('/verificarconsulta/:cpf', async (req, res) => {
    let cpf = req.params.cpf;


    try {
        const consulta = await db.verificarConsultaPorCPF(cpf);

        // Sempre retornar 200 OK, mesmo se a consulta não existir
        if (consulta) {
            return res.status(200).json({
                message: 'Paciente já possui uma consulta agendada.',
                consulta: consulta, // Retorna os detalhes da consulta, se houver
                hasConsulta: true   // Indicador que o paciente tem consulta
            });
        } else {
            return res.status(200).json({
                message: 'Nenhuma consulta encontrada para este CPF.',
                hasConsulta: false  // Indicador que o paciente não tem consulta
            });
        }
    } catch (error) {
        console.error('Erro ao verificar a consulta:', error);
        return res.status(500).json({ message: 'Erro ao verificar a consulta.' });
    }
});

endpoints.post('/verificar-cpf', async (req, res) => {
    const { cpf } = req.body;


    try {
        const existe = await db.verificarCPFExistente(cpf);
        return res.status(200).json({ existe });
    } catch (error) {
        console.error('Erro ao verificar CPF:', error);
        return res.status(500).json({ message: 'Erro ao verificar CPF.' });
    }
});



endpoints.post('/horarios-ocupados', async (req, res) => {
    const { data } = req.body;

    try {
        const horariosOcupados = await db.obterHorariosOcupados(data);

        return res.status(200).json({ horariosOcupados });
    } catch (error) {
        console.error('Erro ao obter horários ocupados:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }

});

endpoints.put('/finalizarConsulta/:cpf', async (req, resp) => {

    let cpf = req.params.cpf

    try {

        const resposta = await db.FinalizarConsulta(cpf)

        if(resposta > 0) {
        return resp.send({
            sucesso: 'Finalizada com sucesso'
        })
        }

    } catch (error) {
        console.log(error)
        resp.status(500).send({
            error: 'Algo está errado'
        })
    }

})

endpoints.get('/puxarfinanceiro/:ano', async (req, resp) => {
    try {

        const ano = parseInt(req.params.ano);

        let dados = await db.PuxarFinanceiro(ano);

        console.log(dados);
        resp.send(dados);
        
    } catch (error) {
        resp.status(400).send({
            erro: error.message
        });
    }
});

export default endpoints;