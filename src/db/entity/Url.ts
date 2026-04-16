import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()

export class Url {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", {
        nullable: false
    })
    originalUrl: string;

    @Column("text", {
        nullable: false,
        unique: true
    })
    shortUrl: string;

    @Column("boolean", {
        nullable: false,
        default: true
    })
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.url)
    @JoinColumn({ name: "userId" })
    user: User;
}