<?php

namespace App\Entity;

use App\Repository\PartidaRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;

#[ApiResource]
#[ApiFilter(SearchFilter::class, properties: ['liga' => 'exact'])]
#[ORM\Entity(repositoryClass: PartidaRepository::class)]

class Partida
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'partidas')]
    private ?Liga $liga = null;

    #[ORM\Column(nullable: true)]
    private ?int $jornada = null;

    #[ORM\ManyToOne(inversedBy: 'partidas')]
    private ?Jugadores $jugador = null;

    #[ORM\ManyToOne(inversedBy: 'partidas')]
    private ?Roles $rol = null;

    #[ORM\Column(nullable: true)]
    private ?int $posicion = null;

    #[ORM\Column(nullable: true)]
    private ?bool $dominancia = null;

    #[ORM\Column(nullable: true)]
    private ?int $puntos = null;

    #[ORM\Column]
    private ?bool $terminada = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLiga(): ?Liga
    {
        return $this->liga;
    }

    public function setLiga(?Liga $liga): static
    {
        $this->liga = $liga;

        return $this;
    }

    public function getJornada(): ?int
    {
        return $this->jornada;
    }

    public function setJornada(?int $jornada): static
    {
        $this->jornada = $jornada;

        return $this;
    }

    public function getJugador(): ?Jugadores
    {
        return $this->jugador;
    }

    public function setJugador(?Jugadores $jugador): static
    {
        $this->jugador = $jugador;

        return $this;
    }

    public function getRol(): ?Roles
    {
        return $this->rol;
    }

    public function setRol(?Roles $rol): static
    {
        $this->rol = $rol;

        return $this;
    }

    public function getPosicion(): ?int
    {
        return $this->posicion;
    }

    public function setPosicion(?int $posicion): static
    {
        $this->posicion = $posicion;

        return $this;
    }

    public function isDominancia(): ?bool
    {
        return $this->dominancia;
    }

    public function setDominancia(?bool $dominancia): static
    {
        $this->dominancia = $dominancia;

        return $this;
    }

    public function getPuntos(): ?int
    {
        return $this->puntos;
    }

    public function setPuntos(?int $puntos): static
    {
        $this->puntos = $puntos;

        return $this;
    }

    public function isTerminada(): ?bool
    {
        return $this->terminada;
    }

    public function setTerminada(bool $terminada): static
    {
        $this->terminada = $terminada;

        return $this;
    }
    public function esPrimero(): bool
    {
        return $this->posicion === 1;
    }
    public function esSegundo(): bool
    {
        return $this->posicion === 2;
    }
    public function esTercero(): bool
    {
        return $this->posicion === 3;
    }
    public function esCuarto(): bool
    {
        return $this->posicion === 2;
    }
}
