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
 * read-only tests against the cli's help APIs
 *
 */

import { ISuite } from '../../../../tests/lib/common'
import * as common from '../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../tests/lib/ui'
const { cli, selectors, sidecar } = ui

const actionName1 = 'foo1'
const actionName2 = 'foo2'

describe('Comments and blank line handling', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should handle blank lines', () => cli.do('', this.app)
    .then(cli.expectBlank))

  it('should handle blank lines with prefix whitespace', () => cli.do('    ', this.app)
    .then(cli.expectBlank))

  it('should handle comment-only lines', () => cli.do('# hello', this.app)
    .then(cli.expectBlank))

  it('should handle comment-only lines with surrounding whitespace', () => cli.do('  #hello  ', this.app)
    .then(cli.expectBlank))

  it('should handle a command with suffix comment', () => cli.do(`let ${actionName1} = x=>x  #hello  `, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName1)))

  it('should handle a command with suffix comment', () => cli.do(`let ${actionName2} = x=>x ### ### # #    hello  `, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName2)))

  it('should handle a commented-out command', () => cli.do(`#let ${actionName2} = x=>x`, this.app)
    .then(cli.expectBlank))

  it('should handle a commented-out command with intermingled whitespace', () => cli.do(`#     let ${actionName2} = x=>x`, this.app)
    .then(cli.expectBlank))

  it('should handle a commented-out command with suffix comment', () => cli.do(`#let ${actionName2} = x=>x ### ### # #    hello  `, this.app)
    .then(cli.expectBlank))

  it('should handle a commented-out parse-error', () => cli.do(`#letty ${actionName2} = x=>x ### ### # #    hello  `, this.app)
    .then(cli.expectBlank))

  it('should handle a commented-out parse-error 2', () => cli.do(`#let ${actionName2} =))))- -(((( x=>x ### ### # #    hello  `, this.app)
    .then(cli.expectBlank))
})
