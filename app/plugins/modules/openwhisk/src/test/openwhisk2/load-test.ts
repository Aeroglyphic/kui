/*
 * Copyright 2017 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ISuite } from '../../../../../../../tests/lib/common'
import * as common from '../../../../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../../../../tests/lib/ui'
const { cli, rp, selectors, sidecar } = ui

const actionName = 'foo'

describe('Load tester', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('create an action', () => cli.do(`let ${actionName} = x=>x`, this.app)
    .then(cli.expectJustOK)
    .catch(common.oops(this)))

  const key = 'y'
  const value = 1
  it('load test it with wsk testing loadtest', () => cli.do(`wsk testing loadtest ${actionName} --numIters 20 --numThreads 1 --thinkTime 0 -p ${key} ${value} --validator "numErrors=(results.length===20 ? 0 : 1) + results.reduce((errCount,v)=>errCount+(v.${key}!==${value} ? 1 : 0),0);"`, this.app)
    .then(cli.expectOKWithCustom({ expect: 'Run was valid' }))
    .catch(common.oops(this)))

  it('load test it with lt', () => cli.do(`lt ${actionName} --numIters 20 --numThreads 2 --thinkTime 0 -p ${key} ${value} --validator "numErrors=(results.length===40 ? 0 : 1) + results.reduce((errCount,v)=>errCount+(v.${key}!==${value} ? 1 : 0),0);"`, this.app)
    .then(cli.expectOKWithCustom({ expect: 'Run was valid' }))
    .catch(common.oops(this)))

  it('load test it with lt with no params', () => cli.do(`lt ${actionName} --numIters 20 --numThreads 2 --thinkTime 0`, this.app)
    .then(cli.expectOKWithCustom({ expect: 'Run was valid' }))
    .catch(common.oops(this)))
})
