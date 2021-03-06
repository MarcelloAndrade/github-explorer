import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import logo from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles'
import Repository from '../Repository';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storegedRepositories = localStorage.getItem('@GithubExplorer:repositories');
        if(storegedRepositories){
            return JSON.parse(storegedRepositories);
        }
        return [];
    });

    useEffect(() => {localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))}, [repositories]);

    async function handleAddRepository(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if(!newRepo) {
            setInputError("Digite o autor/nome do repositório.");
            return;
        }

        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);
            const repository = response.data;
            console.log(response);
            setRepositories([ ...repositories, repository ]);
            setNewRepo('');
            setInputError('');
        } catch (error) {
            setInputError("Erro na busca pelo repositório.");
        }
    }

    return (
        <>
            <img src={logo} alt="github explorer"/>
            <Title>Explorer repositórios no Github</Title>

            <Form hasError={!! inputError} onSubmit={handleAddRepository}>
                <input value={newRepo} 
                       onChange={e => setNewRepo(e.target.value)}
                       placeholder="Digite o nome do repositório"/>
                <button type="submit">Pesquisar</button>
            </Form>

            { inputError && <Error>{inputError}</Error> }

            <Repositories>
                {repositories.map(r => (
                    <Link key={r.full_name} to={`/repository/${r.full_name}`}>
                        <img src={r.owner.avatar_url} 
                            alt={r.owner.login}>
                        </img>
                        <div>
                            <strong>{r.full_name}</strong>
                            <p>{r.description}</p>
                        </div>
                        <FiChevronRight size={20}/>
                    </Link>
                ))}
            </Repositories>           
        </> 
    )
}

export default Dashboard;