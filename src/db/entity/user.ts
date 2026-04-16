import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Url } from "./Url";

@Entity()

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", {
        nullable: false
    })
    name: string;

    @Column("text", {
        nullable: false,
        unique: true
    })
    email: string;

    @Column("text", {
        nullable: false
    })
    password: string;

    @Column("boolean", {
        nullable: false,
        default: false
    })
    isVerified: boolean;

    @Column("varchar", {
        length: 6,
        nullable: true,
        default: null
    })
    verificationCode: string | null;

    @Column("date", {
        nullable: true
    })
    birthday: string | null;

    @OneToMany(() => Url, (url) => url.user)
    url: Url[];
}