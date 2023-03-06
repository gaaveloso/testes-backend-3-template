import { UserBusiness } from "../../src/business/UserBusiness"
import { LoginInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("login", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("login bem-sucedido em conta normal retorna token", async () => {
        const input: LoginInputDTO = {
            email: "normal@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("login bem-sucedido em conta admin retorna token", async () => {
        const input: LoginInputDTO = {
            email: "admin@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-admin")
    })

    test("testar erro no login NAME", async () => {
        expect.assertions(1)

        const input = {
            email: "example@email.com",
            name: null,
            password: "bananinha"
        }

        try {
            await userBusiness.signup(input)
        } catch (error) {
            if(error instanceof BadRequestError) {
                expect(error.message).toBe("'name' deve ser string")
            }
        }
    })

    test("testar erro no login EMAIL", async () => {
        expect.assertions(1)

        const input = {
            email: null,
            name: "Example Mock",
            password: "bananinha"
        }

        try {
            await userBusiness.signup(input)
        } catch (error) {
            if(error instanceof BadRequestError) {
                expect(error.message).toBe("'email' deve ser string")
            }
        }
    })

    test("Testar erro de email não encontrado", async () => {
        const input: LoginInputDTO = {
            email: "teste@email.com",
            password: "bananinha"
        }

        expect(async () => {
            await userBusiness.login(input)
        }).rejects.toThrow("'email' não cadastrado")
    })

    test("Testar erro de senha incorreta", async () => {
        const input: LoginInputDTO = {
            email: "normal@email.com",
            password: "bananinha33"
        }

        expect(async () => {
            await userBusiness.login(input)
        }).rejects.toThrow("'password' incorreto")
    })
})