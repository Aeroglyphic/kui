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

/**
 * tests that create an action and test that it shows up in the list UI
 *    this test also covers toggling the sidecar
 */

import { ISuite } from '../../../../../../../tests/lib/common'
import * as common from '../../../../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../../../../tests/lib/ui'
const { cli, rp, selectors, sidecar } = ui

const actionName = 'long'

describe('Invoke asynchronously and await', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  // create an action, using the implicit entity type
  it('should create an action', () => cli.do(`create ${actionName} ./data/openwhisk/long.js`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName)))

  // create the second action
  it('should do an async of the action, using implicit context', () => cli.do(`async`, this.app)
    .then(cli.expectJustOK))

  // call await
  it('should await completion of the activation', () => cli.do(`$ await`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName)))

  // make sure we can do in-context activation commands
  it('should show activation logs', () => cli.do(`wsk activation logs`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName)))
})
