import { VCD } from '../vcd.core'
import * as types from '../vcd.types'
import { vcd_schema } from '../vcd.schema';

test('test_base64', () => {
    // To avoid adding OpenCV to this test suite, let's bring the chain from the VCD Python API tests
    let payload_b64_str = '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'
    
    // 5.- Insert into VCD
    let vcd = new VCD()
    let vcd_image = new types.Image('labels', payload_b64_str, 'image/png', 'base64')
    let uid = vcd.addObject('', '')
    vcd.addObjectData(uid, vcd_image)

    //console.log(vcd.stringify(false))
    expect(vcd.stringify(false)).toBe('{"vcd":{"frames":{},"schema_version":"4.3.0","frame_intervals":[],"objects":{"0":{"name":"","type":"","object_data":{"image":[{"name":"labels","val":"iVBORw0KGgoAAAANSUhEUgAAAeAAAAKACAIAAADLqjwFAAAKu0lEQVR42u3dPW7VYBCGUSe6JWW6NCyDErEvKvaFKFkGDR0lfYiEkABFN8n9+fzOzDkFDRLgAT0a2Z/NtgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABc0uevb25MASCwzo8/CjRAYp0FGiC0zgINEFpngQYIrbNAA4TWWaABQuss0AChdRZogMQ0CzRAbp0FGiC0zgINEFpngQYIrbNAA4TWWaABQuv84d1PgQZIrLMNGiC0zrmBfv/2o7/U0r58+2QIcE6dH90aH0BgnQUaILTOjw6GCLBvmp+ssw0aILTOAg0QWmeBBgits0ADhNZ585AQYH2dn02zDRogt85VN+jjb6nt9RbizY/vD3f3/rGCOl+kzptbHCdU+LSf1W5Q51fVWaDPLfLJv45egzoL9M5dfvbXV2pQZ4FOSfOTv51MQ9c0n1xngd4zzTIN6izQ0WmWaVBngY5Os0yDOgt0dJplGtT5b0PfJAyvc7k/J6jzxetcdYM+513BcsmzSkOhOl8qzRM36LoLqVUaptV5VqCrN06jYVSdBwW6R900GubUeUqgO3VNo2FInUcEul/RNBom1Hlrfw66a8t8exp2T/O169x8g+69adqjoXedOwd6Qr80GhrXuW2g55RLo6FrnXsGelqzNBpa1nnzNTtAnQPT3HODnrlOWqKhX527BXpypzQamtV5G/u5UUCdw+vcKtBWSBOATnW2QQPqHFrnPoG2PJoDNKvz5pgdIM2ZdW6yQVsbTQP61XlzDxpQ58w6dwi0hdFMoGWdbdCAOofWeav+kNCqeGQyvuiPOtdNsw0aUOfcOgs0oM65Cgfa/Q3zgcZ1tkED6izQAOr8Sl71BgaluVCdbdCAOgv0pXkCZkqoc+8626ABdRZoAHUWaECdG9R5c4oDaFznumm2QQPqLNAA6izQgDr3qLNAA+os0Bfl/QuzQp3b13kreorj4e5ed14+K0NgQpr71XlziwNQZ4EGUGeBBtRZoAHU+Xq86g2UrHPvNNugAXUWaAB1FmhAnQV6Z96/MCXUWaAB1HkfTnEA6WmeWWcbNKDOAg2gznMC7QmY+aDOAg2gzgINqLM6/1H7FIcv9x+ZjCFQtM7SbIMG1FmgrYpmgjqrsw0aUGeBtjCaBqizQAPqPFWTb3E4zmF9pmKa1dkGDaizQFseTQB1VmeBBtRZoK2Qrh3UeR/dPtg/82mhOlOlztI8d4MG1FmgrZOuF3VWZ4HWLFeKOgu0crlGUGeB1i9XhzozO9CNK6bOqPMEh/ZX2O/gnTqTn2Z1tkFPLJo6o84CrdGuAtRZoNVNnVFnhge6dOPUGXUe6DDtgn+XrtBjQ2mmRJ2l2QY9rnrqjDrboOc2OnaVlmbUmcPw6w/MtDSjzgh0XKalGXVGoOMyLc2oMwIdl2lpplya1VmgIzJ9vVLrMuqMQF+4pCf3WpFRZwR6aa//a7cKo85ckP80dkW7QZ0RaECd+3CLA9RZmm3QgDoj0IA6CzSgzgg0oM4CDagzCZziAGlWZxs0oM4INKizOgs0oM4INKDOw3hICHPrLM02aECdEWhQZ3UWaECdEWhAnQUaUGcEGlBnnuWYHfRPszrboAF1RqBBndVZoAF1RqABdeYfHhJCwzpLsw0aUGcEGtRZnQUaUGcEGlBnBBrUmYKc4oDaaVZnGzSgzgg0qLM6I9Cgzgg0oM4INKgzXTjFAZXqLM02aECd2d+NEYA6I9CAOiPQoM4INKDOCDTMSrM6I9Cgzgg0qLM6I9Cgzgg0oM4INHSvszQj0KDOCDSoszoj0KDOCDSgzgg0qDMCDSxOszoj0KDOCDSoszoj0KDOCDSgzgg0qDMINKyvszQj0KDOCDSoszoj0KDOCDSgzgg0qDMINCxOszoj0KDOCDSoszoj0KDOINCgzgg0dK+zNCPQoM4INKizOiPQoM4g0KDOCDSoMwg0qDMCDdKszgg0qDMINOqszgg0qDMINKgzAg3t6yzNCDSoMwg06qzOCDSoMwg0qDMCDeoMAg2L06zOCDSoMwg06qzOCDSoMwg0qDMCDeoMAg3r6yzNCDSoMwg06qzOCDSoMwg0qDMCDeoMAg2L06zOCDSoMwg06qzOCDSoMwg0qDMINN3rLM0INKgzCDTqrM4INKgzCDSoMwg06gwCDeoMAo00qzMCDeoMAo06qzMINOoMAg3qDAJN+zpLMwIN6gwCjTqrMwg06gwCDeoMAo06g0DD4jSrMwg06gwCjTqrMwg06gwCDeoMAo06g0DD+jpLMwg06gwCjTqrMwg06gwCDeoMAo06AwLN4jSrMwg06gwCjTqrMwg06gwCDeoMAk33OkszCDTqDAKNOqszCDTqDAIN6gwCjToDAs3iNKszCDTqDAKNOqszCDTqDAg06gwCjToDAs36OkszCDTqDAKNOqszCDTqDAg06gwCjToDAs3iNKszCDTqDAi0OqszCDTqDAg06gwCTfc6SzMINOoMCLQ6qzMINOoMCDTqDAKNOgMCjToDAi3N6gwCjToDAq3O6gwCjToDAo06g0DTvs7SDAKNOgMCrc7qDAKNOgMCjToDAq3OgECzOM3qDAKNOgMCrc7qDAKNOgMCjToDAq3OgECzvs7SDAKNOgMCrc7qDAJtBOoMCDTqDAi0OgMCzeI0qzMINOoMCLQ6qzMg0OoMCDTqDAh09zpLMwg06gwItDqrMyDQ6gwINOoMCLQ6AwKNOgMCLc3qDAi0OgMCrc7qDAi0OgMCjToDAt2+ztIMCLQ6AwKtzuoMCLQ6AwKNOgMCrc4AAr04zeoMCLQ6AwKtzuoMCLQ6AwKNOgMCrc4AAr2+ztIMCLQ6AwKtzuoMCLQ6Awi0OgMCrc4AAr04zeoMCLQ6AwKtzuoMCLQ6Awi0OgMC3b3O0gwItDoDAq3O6gwItDoDCLQ6AwKtzgACvTjN6gwItDoDTA20OgMCrc4AAq3OgECrM4BA71lnaQYEWp0BpgZanQGBVmcAgVZnQKDVGUCgd0uzOgMCrc4AUwOtzoBAqzOAQKszQN1AO7ABCLQ6Awi0OgPUDbQ6AwKtzgACrc4AdQOtzoBAl0+zOgMCrc4AUwOtzgCJgVZngMRAqzNAYqAd2ABIDLQ6AyQGWp0BEgOtzgCJgVZngMRAqzNAXKAdpwNIDLQ6AyQGWp0BEgOtzgCJgVZngMRAqzNAYqAdpwNIDLQ6AyQGWp0BEgOtzgCJgVZngMRAqzPAmW4T/hDqDJAYaHUGeNJVbnG8/P6GOgMsDfQLG63OAEfsdotDnQGOO0gzQKbV56DVGSDICd+xAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqOcXcO/DOJCe2z8AAAAASUVORK5CYII=","mime_type":"image/png","encoding":"base64"}]},"object_data_pointers":{"labels":{"type":"image","frame_intervals":[]}}}}}}')

    // 6.- Get and decode
    let od = vcd.getObjectData(uid, 'labels')
    expect(od['mime_type']).toBe('image/png')
    expect(od['encoding']).toBe('base64')
    let payload_b64_read = od['val']
    expect(payload_b64_read).toBe(payload_b64_str)
    let payload_read = btoa(payload_b64_read)    
});


