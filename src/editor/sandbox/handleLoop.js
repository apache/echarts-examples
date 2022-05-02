/**
 * This function is used to prevent the page from getting stuck
 * for the infinite loop in the user code.
 *
 * @param {string} code the source code
 */
function handleLoop(code) {
  let AST;
  try {
    AST = acorn.parse(code, {
      ecmaVersion: 'latest',
      sourceType: 'script'
    });
  } catch (e) {
    console.error('failed to parse code', e);
    return code;
  }

  /**
   * Temporarily store the range of positions where the code needs to be inserted
   */
  const fragments = [];
  /**
   * loopID is used to mark the loop
   */
  let loopID = 1;
  /**
   * Mark the code that needs to be inserted when looping
   */
  const insertCode = {
    setMonitor: 'LoopController.loopMonitor(%d);',
    delMonitor: ';LoopController.delLoop(%d);'
  };

  // Traverse the AST to find the loop position
  estraverse.traverse(AST, {
    enter(node) {
      switch (node.type) {
        case 'WhileStatement':
        case 'DoWhileStatement':
        case 'ForStatement':
        case 'ForInStatement':
        case 'ForOfStatement':
          // Gets the head and tail of the loop body
          let { start, end } = node.body;
          start++;
          let pre = insertCode.setMonitor.replace('%d', loopID);
          let aft = '';
          // If the body of the loop is not enveloped by {} and is indented, we need to manually add {}
          if (node.body.type !== 'BlockStatement') {
            pre = '{' + pre;
            aft = '}';
            --start;
          }
          fragments.push({ pos: start, str: pre });
          fragments.push({ pos: end, str: aft });
          fragments.push({
            pos: node.end,
            str: insertCode.delMonitor.replace('%d', loopID)
          });
          ++loopID;
          break;
        default:
          break;
      }
    }
  });

  // Insert code to corresponding position
  fragments
    .sort((a, b) => b.pos - a.pos)
    .forEach((fragment) => {
      code =
        code.slice(0, fragment.pos) + fragment.str + code.slice(fragment.pos);
    });

  return code;
}
