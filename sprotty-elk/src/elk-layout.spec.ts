/********************************************************************************
 * Copyright (c) 2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { Container } from 'inversify';
import ElkConstructor from 'elkjs/lib/elk.bundled';
import { SGraphSchema, SNodeSchema, SEdgeSchema } from 'sprotty';
import { ElkFactory, ElkLayoutEngine } from './elk-layout';
import elkLayoutModule from './di.config';

describe('ElkLayoutEngine', () => {
    const container = new Container();
    container.load(elkLayoutModule);
    container.bind(ElkFactory).toConstantValue(() => new ElkConstructor({
        algorithms: ['layered']
    }));

    it('arranges a very simple graph', async () => {
        const elkEngine = container.get(ElkLayoutEngine);
        const graph: SGraphSchema = {
            type: 'graph',
            id: 'graph',
            children: [
                <SNodeSchema> {
                    type: 'node',
                    id: 'node0',
                    size: { width: 10, height: 10 }
                },
                <SNodeSchema> {
                    type: 'node',
                    id: 'node1',
                    size: { width: 10, height: 10 }
                },
                <SEdgeSchema> {
                    type: 'edge',
                    id: 'edge0',
                    sourceId: 'node0',
                    targetId: 'node1'
                }
            ]
        };

        const result = await elkEngine.layout(graph);

        expect(result).to.deep.equal(<SGraphSchema> {
            type: 'graph',
            id: 'graph',
            children: [
                <SNodeSchema> {
                    type: 'node',
                    id: 'node0',
                    position: { x: 12, y: 12 },
                    size: { width: 10, height: 10 }
                },
                <SNodeSchema> {
                    type: 'node',
                    id: 'node1',
                    position: { x: 42, y: 12 },
                    size: { width: 10, height: 10 }
                },
                <SEdgeSchema> {
                    type: 'edge',
                    id: 'edge0',
                    sourceId: 'node0',
                    targetId: 'node1',
                    routingPoints: [
                        { x: 22, y: 17 },
                        { x: 42, y: 17 }
                    ]
                }
            ]
        });
    });
});
