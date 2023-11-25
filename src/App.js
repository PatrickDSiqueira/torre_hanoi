// Grupo:
//
// Nome: Leandro Sales Santos
// RA: 12113476
// Nome:Lucas de Oliveira Rodrigues Abreu
// RA: 12114651
// Nome: Patrick Dias Siqueira
// RA: 12114788
// Nome: Talison de Jesus Moura
// RA: 12114853


import React, { useRef, useState } from 'react';
import './style.css';
import { Toast } from "primereact/toast";
import img from "../src/img.png"
import { Button } from "primereact/button"
const App = () => {


    const [torres, setTorres] = useState({
        1: [
            { class: 'orange', id: 6 },
            { class: 'yellow', id: 5 },
            { class: 'red', id: 4 },
            { class: 'green', id: 3 },
            { class: 'purple', id: 2 },
            { class: 'blue', id: 1 },
        ],
        2: [],
        3: [],
    })
    const [from, setFrom] = useState(false);
    const [to, setTo] = useState(false);
    const [disk, setDisk] = useState(false);
    const [info, setInfo] = useState(false);
    const [runningSolutcion, setRunningSolutcion] = useState(false);


    const [jogadas, setJogadas] = useState(0);
    const toast = useRef(null);

    const show = (label, type) => {
        toast.current.show({ severity: type, detail: label });
    };

    const clickTorre = (torreId) => {

        if (!from) {

            if (torres[torreId].length === 0) {

                return show("Torre vazia", "info")
            }

            return setFrom(torreId);
        }

        if (torreId === from) {

            setFrom(false);
            return show("Escolha uma torre diferente", "info")
        }

        const torreFrom = torres[from];
        const torreTo = torres[torreId];

        const lastDisk = torreFrom[torreFrom.length - 1];
        const firstDisk = torreTo[torreTo.length - 1];

        if (!firstDisk || firstDisk.id > lastDisk.id) {

            moveDisk(torreFrom, torreTo, lastDisk);

            setFrom(false);
            setDisk(false);

            if (!torres[1].length && !torres[2].length) {
                return show("Voce ganhou", "success")
            }

            return;
        }

        return show("Movimento incorreto", "warn")
    }

    const moveDisk = (torreOrigem, torreDestino, disco) => {

        torreDestino.push(disco);
        torreOrigem.pop();
        setTorres({ ...torres });
        setJogadas(jogadas + 1);
    };

    const reiniciarJogo = () => {

        console.log(torres);
        setTorres({
            1: [
                { class: 'orange', id: 6 },
                { class: 'yellow', id: 5 },
                { class: 'red', id: 4 },
                { class: 'green', id: 3 },
                { class: 'purple', id: 2 },
                { class: 'blue', id: 1 },
            ],
            2: [],
            3: [],
        });

        setJogadas(0);
    };

    const resolverTorresDeHanoi = async (n, origem, destino, auxiliar) => {

        if (n === 1) {

            const torreOrigem = torres[origem];
            const torreDestino = torres[destino];
            const disco = torreOrigem[torreOrigem.length - 1];

            moveDisk(torreOrigem, torreDestino, disco);

            await new Promise((resolve) => setTimeout(resolve, 1000));

        } else {

            await resolverTorresDeHanoi(n - 1, origem, auxiliar, destino);

            await resolverTorresDeHanoi(1, origem, destino, auxiliar);

            await resolverTorresDeHanoi(n - 1, auxiliar, destino, origem);
        }
    };

    const solucao = async () => {

        reiniciarJogo();

        setRunningSolutcion(true);

        const numeroDeDiscos = torres[1].length;

        await resolverTorresDeHanoi(numeroDeDiscos, 1, 3, 2);

        show("Jogo resolvido automaticamente", "success");

        setRunningSolutcion(false);
    };

    const generateDisk = (towerId) => {

        return torres[towerId].map((disk, indice) => {

            const isSelected = from === towerId && torres[towerId].length - 1 == indice;

            return <button
                className={`${disk.class} ${isSelected && "selected"}`}
                id={disk.id} />
        })
    }

    return (
        <div className="container">
            <div className="imageContainer">
                <img src={img} alt="icone" />
            </div>
            <span className='headerText'>
        Para jogar, clique na torre de onde você deseja tirar o disco e depois clique na torre onde você deseja colocar esse disco. Discos com tamanhos maiores não podem ser colocados em cima de discos com tamanhos menores. Boa sorte!
      </span>
            <div className="buttonContainer">
                <Button disabled={runningSolutcion} onClick={reiniciarJogo}>Reiniciar Jogo</Button>
                <Button loading={runningSolutcion} onClick={solucao}>Solução</Button>
                <span className="movements">Jogadas: {jogadas}</span>
            </div>
            <div className="hanoi">
                <Toast ref={toast} />
                <span>{info}</span>
                <div className="gameArea">
                    <div className="startPosition">

                        <div className="tower" onClick={() => clickTorre(1)}>
                            {generateDisk(1)}
                        </div>
                        <span className="towerText">Torre 1</span>
                    </div>
                    <div className="offsetPosition">
                        <div className="tower" onClick={() => clickTorre(2)}>
                            {generateDisk(2)}
                        </div>
                        <span className="towerText">Torre 2</span>
                    </div>
                    <div className="endPosition">
                        <div className="tower" onClick={() => clickTorre(3)}>
                            {generateDisk(3)}
                        </div>
                        <span className="towerText">Torre 3</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default App;
