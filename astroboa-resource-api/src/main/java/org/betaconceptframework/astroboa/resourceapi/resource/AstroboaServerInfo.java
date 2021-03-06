/*
 * Copyright (C) 2005-2012 BetaCONCEPT Limited
 *
 * This file is part of Astroboa.
 *
 * Astroboa is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Astroboa is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Astroboa.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.betaconceptframework.astroboa.resourceapi.resource;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.betaconceptframework.astroboa.resourceapi.utility.ContentApiUtils;
import org.betaconceptframework.astroboa.serializer.RepositoryRegistrySerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Resource responsible to return info in XML or JSON
 * about the available repositories 
 * 
 * @author Gregory Chomatas (gchomatas@betaconcept.com)
 * @author Savvas Triantafyllou (striantafyllou@betaconcept.com)
 * 
 */
@Path("/")
public class AstroboaServerInfo {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@GET
	@Produces("*/*")
	public Response getAstroboaServerInfoAnyResponse(
			@QueryParam("output") String output, 
			@QueryParam("callback") String callback,
			@QueryParam("prettyPrint") String prettyPrint){
		
		return procudeAstroboaServerInfo(ContentApiUtils.getOutputType(output, Output.XML), callback, prettyPrint);
	}
	
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	public Response getAstroboaServerInfoAsJson( 
			@QueryParam("output") String output, 
			@QueryParam("callback") String callback,
			@QueryParam("prettyPrint") String prettyPrint){
		
		return procudeAstroboaServerInfo(ContentApiUtils.getOutputType(output, Output.JSON), callback, prettyPrint);
	}

	@GET
	@Produces({MediaType.APPLICATION_XML})
	public Response getAstroboaServerInfoAsXml( 
			@QueryParam("output") String output, 
			@QueryParam("callback") String callback,
			@QueryParam("prettyPrint") String prettyPrint){
		
		return procudeAstroboaServerInfo(ContentApiUtils.getOutputType(output, Output.XML), callback, prettyPrint);
	}

	private Response procudeAstroboaServerInfo(Output output, String callback, String prettyPrint){
		
		//Produce Astroboa Server Info
		boolean prettyPrintEnabled = ContentApiUtils.isPrettyPrintEnabled(prettyPrint);
		
		StringBuilder resourceRepresentation = new StringBuilder();
		
		RepositoryRegistrySerializer repositoryRegistrySerializer = new RepositoryRegistrySerializer(prettyPrintEnabled, Output.JSON == output);
		
		String result = repositoryRegistrySerializer.serialize();
		
		if (StringUtils.isNotBlank(callback)) {
		
			if (Output.XML == output){
				ContentApiUtils.generateXMLP(resourceRepresentation, result, callback);
			}
			else{
				ContentApiUtils.generateJSONP(resourceRepresentation, result, callback);
			}
			
			return ContentApiUtils.createResponse(resourceRepresentation, output, callback, null);
		}
		else{
			resourceRepresentation.append(result);
			return ContentApiUtils.createResponse(resourceRepresentation, output, callback, null);
		}
		
	}
	
}
